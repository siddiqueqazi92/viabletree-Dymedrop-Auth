const randomstring = require("randomstring");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
  comparePrevPassword: async function (newPassword, prevPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(newPassword, prevPassword, async (err, res) => {
        if (err) {
          sails.log.error("Error changing password.", err);
          return reject(
            "Error changing password. Please try again or contact administrator"
          );
        }

        return resolve(res);
      });
    });
  },
  generateOtp: function () {
    return randomstring.generate({
      length: 4,
      charset: "numeric",
    });
  },
  generateRandomString: function (length = 30) {
    return randomstring.generate({ length });
  },
  generateEncryptedPassword: function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          sails.log.error("error generating salt", err);
          return reject(err);
        }
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) {
            sails.log.error("error encrypting password", err);
            return reject(err);
          }

          return resolve(hash);
        });
      });
    });
  },
  sendSms: function (
    // from = "+15005550006",
    // from = "+17183067562",
    from = "+19898502546",
    to = "+923123823470",
    body = "hello world2"
  ) {
    // const accountSid = "ACb49e03d1054df6bfec3da7df28469afd";//live
    // const authToken = "20c88abf1ccaae88e9ceaa0739f5a5d3";//live
    const accountSid = sails.config.TWILIO.SID; //test
    const authToken = sails.config.TWILIO.AUTH_TOKEN; //test
    sails.log({ accountSid, authToken });
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body: body,
        messagingServiceSid: sails.config.TWILIO.MESSAGING_SERVICE_SID,
        to: to,
      })
      .then((message) =>
      sails.log({ msg_sid: message.sid, message: JSON.stringify(message) })
      )
      .done();
  },
};
