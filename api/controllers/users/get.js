module.exports = {


  friendlyName: 'Get Users List',


  description: '',


  inputs: {
    sort: {
      type: 'string'
    },
    range: {
      type: 'string',
    },
    filter: {
      type: 'string'
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
    sails.log.debug('calling users/get');
    try{
      const findOptions = await sails.helpers.getOptions.with({searchFrom: ['name','email'], ...inputs});

      sails.log.debug('findOptions', findOptions);
      const data = await User.find(findOptions);
      const count = await User.count(findOptions.where);
      return exits.adminResponse(  {data: data, options: { routeName: 'users', range: JSON.parse(inputs.range), count: count} });
    }catch(e){
      sails.log.error('error get users', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }


  }


};
