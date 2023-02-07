/**
 * @typedef {Object} SOCIALINPUTS
 * @property {String} token
 * @property {String} tokenType
 * @property {String} email
 * @property {String} name
 * @property {e.Response} res
 * @property {e.Request} req
 */
module.exports = {
  friendlyName: 'Social login',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
    },
    tokenType: {
      type: 'string',
      required: true,
      isIn: ['facebook', 'google', 'apple'],
    },
    email: {
      type: 'string'
    },
    name: {
      type: 'string',
      defaultsTo: ''
    }
  },

  exits: {
    ok: {
      description: 'Send ok response',
      responseType: 'ok',
    },
    serverError: {
      description: 'send server error',
      responseType: 'serverError',
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },
  /**
   *
   * @param {SOCIALINPUTS} inputs
   * @param {*} exits
   * @returns
   */
  fn: async function (inputs, exits) {
    sails.log('calling action user/social-login');
    let req = this.req;
    let res = this.res;

    try {
      let isNewUser = false;
      let response = null;
      let rec = {};
      switch (inputs.tokenType) {
        case 'facebook': {
          response = await sails.helpers.social.fbLogin(inputs.token);
          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: response.name,
              email: response.email,
              image: response.picture.data.url || null,
            };
          }
          break;
        }
        case 'google': {
          response = await sails.helpers.social.googleLogin(inputs.token);

          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: `${response.given_name} ${response.family_name}`,
              email: response.email,
              image: response.picture || null,
            };
          }
          break;
        }
        case 'apple': {
          sails.log.debug('calling apple signon');
          if(!_.isNil(inputs.email)) {
            response = {
              email : inputs.email,
              name: inputs.name
            };
            rec = {
              name: response.name,
              email: response.email,
              image: '',
            };
          }else{
            sails.log.debug('invalid payload: Email is missing');
            return exits.invalid({status: false, data: [], message: 'Email required.'});
          }
          break;
        }
        default:
          throw new Error('Token type is not valid');
      }
      if (rec.email) {
        sails.log.debug('check if user exists');
        let user = await User.findOne({ email: response.email });
        if (!user) {
          isNewUser = true;
          sails.log.debug('user didnot exits. creating user');
          user = await User.create(rec).fetch();
        }

        sails.log.debug('using login');
        const _user = await passportLogin(user, req);

        sails.log.debug('sending response');
        return exits.success({
          status: true,
          data: {..._user,isNewUser},
          message: 'Logged in successfully'
        });
      }
      return exits.ok({
        status: false,
        message: 'Unable to login, invalid token',
        data: [],
      });
    } catch (error) {
      sails.log.error('error in api/controllers/social-login: ====>>>', error);
      return exits.serverError({
        status: false,
        message: 'Something went wrong',
        data: [],
      });
    }
  },
};



function passportLogin(user, req) {
  return new Promise((resolve, reject) => {
    sails.log.debug('trying to login with ', user);
    req.login(user, (err) => { // event loop
      if (err) { return reject(err); }
      sails.log('User ' + user.id + ' has logged in');
      return resolve(user);
    });
  });
}
