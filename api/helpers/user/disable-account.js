const moment = require('moment')

module.exports = {


  friendlyName: 'Disable account',


  description: '',


  inputs: {
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


  fn: async function ({ email }, exits) {
    try {
      sails.log.debug('helper disable-account called. \nTime: ', moment().format());
      await User.updateOne({ email }).set({ is_active: false });
      return exits.success(true)
    } catch (error) {
      sails.log.error('Error at helper disable-account. Error: ', error, '\nTime: ', moment().format())
      return exits.success(false);
    }
  }
};

