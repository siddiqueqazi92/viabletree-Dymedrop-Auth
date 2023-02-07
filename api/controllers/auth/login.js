const passport = require("passport");
const moment = require("moment");

module.exports = {
  friendlyName: "Register",

  description: "Register auth.",

  inputs: {
    contact: {
      type: "ref",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.number)
        );
      },
    },
    email: {
      type: "string",
      required: false,
      isEmail: true,
    },
    password: {
      type: "string",
      required: false,
    },
    currentUser: {
      type: "string",
      required: false,
      isIn: ["creator", "fan"],
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
    sails.log(
      "Action auth/login started. Inputs: ",
      JSON.stringify(inputs),
      "\nTime: ",
      moment().format()
    );

    try {
      // await User.update({ avatar: null }).set({
      //   avatar:
      //     "https://ahauserposts.s3.amazonaws.com/image_2021_11_25T18_57_06_110Z.png",
      // });
      if (!inputs.contact && !inputs.email) {
        sails.log(
          "Action auth/login exited. REASON: '!inputs.contact && !inputs.email'\nTime: ",
          moment().format()
        );
        return exits.ok({
          status: false,
          message: "Invalid phone number or password",
          data: [],
        });
      }
      const req = this.req;
      const res = this.res;
      let where = {};
      if (inputs.contact) {
        where.country_code = inputs.contact.country_code;
        where.contact = inputs.contact.number;
      }
      if (inputs.email) {
        where.email = inputs.email;
      }
      if (!_.isUndefined(inputs.currentUser)) {
        if (inputs.currentUser == "fan") {
          where.currentUser = inputs.currentUser;
        } else {
          where.or = [{ currentUser: "creator" }, { currentUser: "invitee" }];
        }
      }

      const user = await sails.models.user.getOne(where);
      if (!user) {
        sails.log(
          "Action auth/login exited. REASON: 'user not found (invalid creds)'\nTime: ",
          moment().format()
        );
        return exits.ok({
          status: false,
          message: "Invalid email or password",
          data: [],
        });
      }

      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
          sails.log(
            "Action auth/login exited. REASON: 'authentication error' \nError: " +
              JSON.stringify(err) +
              "\nInfo: " +
              JSON.stringify(info) +
              "\nTime: ",
            moment().format()
          );
          sails.log.error(err);
          return exits.ok({
            status: false,
            message: info.message,
            data: [],
          });
        }
        if (user.is_blocked) {
          sails.log(
            "Action auth/login exited. REASON: 'User is blocked by admin'\nTime: ",
            moment().format()
          );
          return exits.ok({
            status: false,
            message: "User is blocked by admin",
            data: [],
          });
        }

        req.logIn(user, async (err) => {
          if (err) {
            sails.log(
              "Action auth/login exited. REASON: 'authentication error' at req.logIn \nError: " +
                JSON.stringify(err) +
                "\nTime: ",
              moment().format()
            );
            sails.log.error(err);
            return exits.ok({
              status: false,
              message: err,
              data: [],
            });
          }
          let data = {};
          data.activation_message = null;
          let is_active = user.is_active;
          if (!is_active) {
            await User.update({ id: user.id }).set({ is_active: true });
            sails.log.debug(
              "temperory-disabled is now enabled . \nTime: ",
              moment().format()
            );
            data.activation_message = "Welcome back!";
          }
          sails.log("User " + user.id + " has logged in.");
          sails.log("Action auth/login ended\nTime: ", moment().format());
          let getUpdatedUser = await User.findOne({ id: user.id });
          let finalData = { ...user, ...getUpdatedUser, ...data };
          console.log({ finalData });
          return exits.success({
            status: true,
            message: "User logged in successfully",
            data: finalData,
          });
        });
      })(req, res);
    } catch (err) {
      sails.log.error(
        `Error in action auth/login. ${err}\nTime: ${moment().format()}`
      );
      return exits.ok({
        status: false,
        message: err,
        data: [],
      });
    }
  },
};
