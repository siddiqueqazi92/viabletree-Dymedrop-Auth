const moment = require('moment')

module.exports = {

  friendlyName: 'Logout',

  description: 'Logout user.',

  inputs: {
    user: {
      type: 'ref'
    }
  },

  exits: {

  },

  fn: async function ({ user }, exits) {
    sails.log.debug('calling user logout\nTime: ', moment().format());
    try {
      // await sails.helpers.jwt.removeToken.with({ token });
      await Token.destroy({ user_id: id })
    } catch (e) {
      sails.log.error('attempt to logout failed ', e);
    }
    sails.log.debug('user logout successfully\nTime: ', moment().format());
    return exits.success({ status: true, data: [], message: 'Logout' });
  }

};
