const {
  generateRandomString,
  generateEncryptedPassword,
} = require("../../../util");
var ejs = require("ejs");
const moment = require("moment");
const path = require("path");

module.exports = {
  friendlyName: "Create Fans",

  description: "Create Fans on Admin Panel.",

  inputs: {
    data: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    badRequest: {
      description: "Bad  Request",
      responseType: "badRequest",
    },
  },

  fn: async function ({ data }, exits) {
    if (!data.email) {
      return exits.error("email is required");
    }
    if (!data.password) {
      return exits.error("password is required");
    }
    // if (data.password != data.confirm_password) {
    //   return exits.error("passwod doesn't match");
    // }
    let obj = { email: data.email };
    if (data.avatar) {
      obj.avatar = data.avatar;
    }
    if (data.avatar) {
      obj.image_url = data.avatar;
    }
    if (data.first_name) {
      obj.first_name = data.first_name;
    }
    if (data.last_name) {
      obj.last_name = data.last_name;
    }
    obj.currentUser = "fan";
    if (data.first_name || data.last_name) {
      let full_name= '';
      if (data.first_name) {
        full_name += `${data.first_name} `;
      }
      if (data.last_name) {
        full_name += `${data.last_name} `;
      }

      sails.log({ full_name });
      obj.full_name = full_name;
    }

    try {
      //   const result = await sails.getDatastore().transaction(async (db) => {
      const password = data.password; //await generateRandomString(12)

      const hashPassword = await generateEncryptedPassword(password);

      obj.password = hashPassword;

      const user = await sails.models.user
        .create({ ...obj, is_form_submitted: true, status: "approved" })
        .fetch();

      //TODO: send email/otp confirmation before login

      ejs.renderFile(
        path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "views",
          "mails",
          "sendPassword.ejs"
        ),
        { password, email: obj.email },
        function (err, data) {
          if (err) {
            sails.log(`Action auth/register caught an error while views for email (.ejs). Error: ${err}
      Time: ${moment().format()}`);
            return exits.error({
              status: false,
              message: err.message,
              data: [],
            });
          } else {
            const subject = `Your Dymedrop Account Password`;
            console.log(data.email, subject, data);
            sails.helpers.mail.mandrill.send(obj.email, subject, data);
          }
        }
      );
      sails.log(`Action auth/register executed
                Time: ${moment().format()}`);
      // sails.log(result)
      // return user;
      //   });

      return exits.success({
        status: true,
        data: user,
        message: "user created",
      });
    } catch (error) {
      sails.log.error(error);
      if (error.raw === "Email already registered") {
        return exits.badRequest({
          status: false,
          data: [],
          message: "Email already registered",
        }); //({ status: false, data: [], message: 'email already registered' })
      }
      return exits.badRequest({
        status: false,
        data: [],
        message: "unknown server error",
      });
    }
  },
};
