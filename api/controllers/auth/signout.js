const moment = require('moment');

module.exports = {


  friendlyName: 'Auth Logout',


  description: 'Logout auth.',


  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function ({ token }, exits) {
    sails.log.debug('calling logout\nTime: ', moment().format());
    try {
      await sails.helpers.jwt.removeToken.with({ token });
    } catch (e) {
      sails.log.error('attempt to logout failed ', e);
    }
    return exits.success({ status: true, data: [], message: 'Logout' });

  }


};
