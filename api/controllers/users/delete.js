module.exports = {


  friendlyName: 'Delete User',


  description: '',


  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },


  exits: {
    adminResponse: {
      responseType: 'adminResponse'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },


  fn: async function (inputs, exits) {
    sails.log.debug('calling users/delete');
    try{
      const user = await User.findOne({id: inputs.id});
      if(!user){
        throw new Error('user not found.');
      }

      await User.destroy({id: inputs.id});
      await Token.destroy({user_id: inputs.id});
      sails.log.debug('deleted user');
      this.res.setHeader('Access-Control-Allow-Origin', '*');
      return exits.success({status: true,data:[],message:'User Deleted Successfully'});
    }catch(e){
      sails.log.error('error delete users', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }


  }


};
