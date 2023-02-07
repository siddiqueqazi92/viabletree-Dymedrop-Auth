const request = require('request');
module.exports = {
  friendlyName: 'Facebook login',

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
    sails.log('calling helper general/fb-login');

    try {
      let fbAppId = sails.config.FACEBOOK.APPID;
      let fbSecretKey = sails.config.FACEBOOK.SECRET;

      var urlToRq = `https://graph.facebook.com/oauth/access_token?client_id=${fbAppId}&client_secret=${fbSecretKey}&grant_type=client_credentials`;

      // Get information about the google user with the specified access token.
      request.get({ url: urlToRq }, (err, response, body) => {
        if (err) {
          sails.log.error(`Error in fb login, Error: ${err}`);
          return exits.success(false);
        }
        var receivedData = JSON.parse(body);
        var app_access_token = receivedData.access_token || null;
        if (app_access_token) {
          urlToRq = `https://graph.facebook.com/debug_token?input_token=${inputs.token}&access_token=${app_access_token}`;

          request.get({ url: urlToRq }, (err2, response2, body2) => {
            if (err2) {
              sails.log.error(`Error in fb login, Error: ${err2}`);
              return exits.success(false);
            }
            var receivedData2 = JSON.parse(body2);
            //console.log("receivedData2:",receivedData2);
            if (!receivedData2.error) {
              fb_user_id = _.isUndefined(receivedData2.data.user_id)
                ? null
                : receivedData2.data.user_id;
              if (fb_user_id) {
                urlToRq = `https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=${inputs.token}`;
                request.get(
                  { url: urlToRq },
                  (err3, response3, body3) => {
                    if (err3) {
                      sails.log.error(`Error in fb login, Error: ${err3}`);
                      return exits.success(false);
                    }
                    var receivedData3 = JSON.parse(body3);
                    console.log('fb user:', receivedData3);
                    return exits.success(receivedData3);
                  }
                ); //end get
              } else {
                return exits.success(false);
              }
            } else {
              return exits.success(false);
            }
          }); //end get
        } else {
          return exits.success(false);
        }
      }); //end get
    } catch (error) {
      sails.log.error('error in helpers/social/fb-login:  ====>', error);
      return exits.success(false);
    }
  },
};
