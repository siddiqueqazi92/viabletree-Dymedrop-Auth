module.exports = {


  friendlyName: 'Profile',


  description: 'Profile get.',


  inputs: {   
    user: {
      type: 'ref',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
    serverError: {
      description: 'send server error',
      responseType: 'serverError',
    },
  },


  fn: async function ({user}, exits) {
    sails.log.debug('calling user/get/profile');
    try{
      const data = await sails.models.user.getOne({id:user.id});
      // user.name = name;
      // user.username = username;
      // user.profile_image = profile_image;
      // const _user = await sails.helpers.jwt.generateToken.with({ user });
      return exits.success({status: true, data: data, message: 'Profile found successfully'});
    }catch(e){
      sails.log.error('error calling user/get/profile', e);
      return exits.serverError({status: false, data: [], message: 'Unable to get profile'})
    }
    // All done.

  }


};
