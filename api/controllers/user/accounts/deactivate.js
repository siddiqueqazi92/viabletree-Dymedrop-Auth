const moment = require('moment')

module.exports = {


  friendlyName: 'Deactivate',


  description: 'Deactivate Account',


  inputs: {
    user: {
      type: 'ref',
      // required: true,
    },
    permanently_delete: {
      type: "boolean",
      required: true,
    }
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


  fn: async function ({ user, permanently_delete }, exits) {

    sails.log.debug('user/accounts/deactivate called. \nTime: ', moment().format());
    try {
      let done;
      if (!permanently_delete) {
        done = await sails.helpers.user.disableAccount(user.email)
        if (!done) {
          throw new Error("Error while deactivating account.");
        }
        sails.log.debug('user account temperory-disabled . \nTime: ', moment().format());
      }

      else {
        done = await sails.helpers.user.deleteAccount(user.id, user.email)
        if (!done) {
          throw new Error("Error while deactivating account.");
        }
        sails.log.debug('user account permanently disabled . \nTime: ', moment().format());
      }

      await Token.destroy({ user_id: user.id })
      sails.log.debug('disabled user\'s token is discarded . \nTime: ', moment().format());

    } catch (e) {
      sails.log.error('attempt to deactivate account failed ', e, '\nTime: ', moment().format());

      return exits.ok({
        status: false,
        data: [],
        message: e.message || "server error",
      });
    }

    sails.log.debug('user/accounts/deactivate successfully executed. \nTime: ', moment().format());
    return exits.success({ status: true, data: { user, permanently_delete }, message: 'User Deactivated' });

  }


};
