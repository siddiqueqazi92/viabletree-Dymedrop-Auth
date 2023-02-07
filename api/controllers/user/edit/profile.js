module.exports = {


  friendlyName: 'Profile',


  description: 'Profile edit.',


  inputs: {
    name: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    profile_image: {
      type: 'string'
    },
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


  fn: async function ({name,username, profile_image, user}, exits) {
    sails.log.debug('calling user/edit/profile');
    try{
      await User.update({id: user.id}).set({name, username,profile_image});
      user.name = name;
      user.username = username;
      user.profile_image = profile_image;
      const _user = await sails.helpers.jwt.generateToken.with({ user });
      return exits.success({status: true, data: _user, message: 'Profile updated successfully'});
    }catch(e){
      sails.log.error('error calling user/edit/profile', e);
      return exits.serverError({status: false, data: [], message: 'Unable to update profile'})
    }
    // All done.

  }


};
