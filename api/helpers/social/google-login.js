const request = require('request');
module.exports = {
  friendlyName: 'Google login',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    sails.log('calling helper social/google-login');

    try {
      var urlToRq = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${inputs.token}`;
      // Get information about the google user with the specified access token.
      request.get({ url: urlToRq }, (err, response, body) => {
        if (err) {
          sails.log(`error social login using google token, Error: ${err}`);
          return exits.success(false);
        }
        const receivedData = JSON.parse(body);

        // const userId = receivedData.sub;
        // const userEmail = receivedData.email;
        // const emailVerified = receivedData.email_verified;
        // const userName = receivedData.name;
        // const userPicture = receivedData.picture;

        if (receivedData.email_verified === false) {
          return exits.success(false);
        } else {
          // AUTHENTICATION VERIFIED, YOU CAN SAVE THE CONNECTED USER IN A SESSION, OR ADD HIM TO THE DATABASE AS A NEW ACCOUNT, OR CHECK IF HE HAS A PREVIOUS ACCOUNT OR WHATEVER YOU WANT...
          return exits.success(receivedData);
        }
      });
    } catch (error) {
      sails.log.error('error in helper/social/google-login: ====>', error);
      return exits.success(false);
    }
  },
};
