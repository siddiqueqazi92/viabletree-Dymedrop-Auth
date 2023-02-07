module.exports = {


  friendlyName: 'Get User Details',


  description: '',


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
  },


  fn: async function ({user}, exits) {
    sails.log.debug('calling user/get', user.id);
    try{
      const _user = await User.findOne({id: user.id});
      sails.log.debug('_user',_user);
      if( _.isNull(_user) || _.isUndefined(_user) ){
        return exits.invalid({status: false,data:[],message: 'Invalid User'});
      }
      return exits.success({status: true, data: _user, message: 'User Listed Successfully'});
    }catch(e){
      sails.log.error('error get user', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }


  }


};
