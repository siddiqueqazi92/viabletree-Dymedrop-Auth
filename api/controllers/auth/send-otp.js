const { generateOtp } = require('../../util')
module.exports = {


  friendlyName: 'Send otp',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
    }
  },


  exits: {

  },


  fn: async function ({email}, exits) {
    sails.log.debug('calling send-opt', email);
    try{
      const user = await sails.models.user.findOne({email});
      if(user) {
        throw new Error('User already exists.');
      }
      const otp = generateOtp();
      const requestedUser = await sails.models.userrequest.findOne({email});
      if(requestedUser){
        sails.log.debug('user already requested for otp - updating otp' );
        await sails.models.userrequest.update({email}).set({otp});
      }else{
        sails.log.debug('user requested for otp first time - creating otp' );
        await sails.models.userrequest.create({email, otp});
      }
      await sails.helpers.auth.sendOtp.with({
        email, otp
      });
      return exits.success({status: true, data: [], message: 'OTP sent to '+ email});
    }catch(e){
      sails.log.debug('error sending otp ', e);
      return exits.success({status: false, data: [], message: e.message || 'Error sending OTP.'});
    }

  }


};
