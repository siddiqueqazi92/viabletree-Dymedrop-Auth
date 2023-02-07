const axios = require('axios')
module.exports = {


  friendlyName: 'Send otp',


  description: '',


  inputs: {
    email: {
      type: 'string',
      isEmail: true,
      required: true
    },
    otp: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function ({email, otp}) {
    sails.log.debug('calling helpers/send-otp', {email, otp});
    const {data} = await axios.post(sails.config.GATEWAY_SERVER+'send-email',{
      to: email,
      subject: 'Verify email',
      msg: `Your OTP is ${otp}`
    });
    return data;
  }


};

