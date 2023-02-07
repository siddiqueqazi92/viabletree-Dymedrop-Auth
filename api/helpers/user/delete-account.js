const moment = require('moment')

module.exports = {


  friendlyName: 'Delete account',


  description: '',


  inputs: {
    user_id: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function ({ user_id, email }, exits) {
    try {
      sails.log.debug('helper delete-account called. \nTime: ', moment().format());
      await DeletedUser.create({ user_id, email })
      await User.destroyOne({ id: user_id })
      exits.success(true)
    } catch (error) {
      sails.log.error('Error at helper delete-account. Error: ', error, '\nTime: ', moment().format())
      exits.success(false)
    }
  }


};

