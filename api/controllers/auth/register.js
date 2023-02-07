const { generateOtp } = require("../../util");
const moment = require("moment");
var fs = require("fs");
const path = require("path");
var ejs = require("ejs");
const axios = require("axios");

module.exports = {
  friendlyName: "Register",

  description: "Register auth.",

  inputs: {
    email: {
      type: "string",
      required: false,
    },
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
    currentUser: {
      type: "string",
    },
    invited: {
      type: "boolean",
    },
    password: {
      type: "string",
      required: true,
      custom: function (value) {
        return value.replace(/\s/g, "").length > 0 && value.length > 5;
      },
    },

    header: {
      type: "ref",
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
    sails.log(`Action auth/register started with inputs: ${JSON.stringify(
      inputs
    )}
    on time: ${moment().format()}`);
    if (!inputs.contact && !inputs.email) {
      sails.log
        .debug(`Action auth/register returned due to: "!inputs.contact && !inputs.email"
      on time: ${moment().format()}`);
      return exits.ok({
        status: false,
        message: "Email is required",
        data: [],
      });
    }
    //TODO: form validations here
    //TODO: check if user is already exists
    // Checking it on lifecycle method
    let otp = generateOtp();
    data = {
      otp,
      otp_generated_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    };
    if (inputs.contact) {
      data.country_code = inputs.contact.country_code;
      data.contact = inputs.contact.number;
    }
    if (inputs.currentUser) {
      data.currentUser = inputs.currentUser;
    }
    if (inputs.email) {
      data.email = inputs.email;
    }
    if (inputs.password) {
      data.password = inputs.password;
    }
    if (inputs.invited) {
      if (inputs.invited == true) {
        data.is_invited = true;
        data.currentUser = "invitee";
      } else {
        data.is_invited = false;
      }
    } else {
      data.is_invited = false;
    }

    UserRequest.create(data)
      .fetch()
      .exec(async (err, user) => {
        if (err) {
          sails.log(`Action auth/register caught an error while creating document(UserRequest) in db. Error: ${err}
          Time: ${moment().format()}`);
          return exits.ok({
            status: false,
            message: err.message,
            data: [],
          });
        }
        delete user.country_code;
        delete user.contact;

        //TODO: send email/otp confirmation before login
        if (inputs.email) {
          ejs.renderFile(
            path.join(
              __dirname,
              "..",
              "..",
              "..",
              "views",
              "mails",
              "registerOtp.ejs"
            ),
            { otp, email: inputs.email },
            function (err, data) {
              if (err) {
                sails.log(`Action auth/register caught an error while views for email (.ejs). Error: ${err}
          Time: ${moment().format()}`);
                return exits.ok({
                  status: false,
                  message: err.message,
                  data: [],
                });
              } else {
                const subject = `Your confirmation code is: ${otp}`;
                sails.helpers.mail.mandrill.send(inputs.email, subject, data);
              }
            }
          );
        }

        sails.log(`Action auth/register succesfully ended with data(user): ${JSON.stringify(
          user
        )}
        Time: ${moment().format()}`);
        return exits.success({
          status: true,
          message: "OTP sent successfully",
          data: user,
        });
      });
  },
};
