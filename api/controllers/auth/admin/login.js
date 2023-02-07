const passport = require("passport");
const moment = require('moment')

module.exports = {
    friendlyName: "Register",

    description: "Register auth.",

    inputs: {
        email: {
            type: "string",
            required: true,
            isEmail: true
        },
        password: {
            type: "string",
            required: true,
        },
    },

    exits: {
        ok: {
            description: "Send ok response",
            responseType: "ok",
        },
        badRequest: {
            description: "Send badRequest response",
            responseType: "badRequest",
        },
    },

    fn: async function (inputs, exits) {
        sails.log("Action auth/login started. Inputs: ", JSON.stringify(inputs), "\nTime: ", moment().format());
        try {

            const req = this.req;
            const res = this.res;
            let where = {};
            if (inputs.email) {
                where.email = inputs.email;
            }
            const user = await sails.models.user.getOne(where);
            if (!user) {
                sails.log("Action auth/login exited. REASON: 'user not found (invalid creds)'\nTime: ", moment().format());
                return exits.ok({
                    status: false,
                    message: "Invalid email or password",
                    data: [],
                });
            }
            if (user.is_blocked) {
                sails.log("Action auth/login exited. REASON: 'User is blocked by admin'\nTime: ", moment().format());
                return exits.ok({
                    status: false,
                    message: "User is blocked by admin",
                    data: [],
                });
            }
            if (_.isUndefined(user.role)) {
                sails.log("Action auth/login exited. REASON: 'User role is not admin'\nTime: ", moment().format());
                return exits.ok({
                    status: false,
                    message: "User role is not admin",
                    data: [],
                })
            }
            passport.authenticate("local", { session: false }, (err, user, info) => {
                if (err || !user) {
                    sails.log("Action auth/login exited. REASON: 'authentication error' \nError: " + JSON.stringify(err) + "\nInfo: " + JSON.stringify(info) + "\nTime: ", moment().format());
                    sails.log.error(err);
                    return exits.ok({
                        status: false,
                        message: info.message,
                        data: [],
                    });
                }

                req.logIn(user, async (err) => {
                    if (err) {
                        sails.log("Action auth/login exited. REASON: 'authentication error' at req.logIn \nError: " + JSON.stringify(err) + "\nTime: ", moment().format());
                        sails.log.error(err);
                        return exits.ok({
                            status: false,
                            message: err,
                            data: [],
                        });
                    }
                    let data = { ...user }
                    data.activation_message = null;
                    let is_active = user.is_active;
                    if (!is_active) {
                        await User.update({ id: user.id }).set({ is_active: true });
                        sails.log.debug('temperory-disabled is now enabled . \nTime: ', moment().format());
                        data.activation_message = "Welcome back!"
                    }
                    sails.log("User " + user.id + " has logged in.");
                    sails.log("Action auth/login ended\nTime: ", moment().format());

                    return exits.success({
                        status: true,
                        message: "User logged in successfully",
                        data,
                    });
                });
            })(req, res);
        } catch (err) {
            sails.log.error(`Error in action auth/login. ${err}\nTime: ${moment().format()}`);
            return exits.ok({
                status: false,
                message: err,
                data: [],
            });
        }
    },
};
