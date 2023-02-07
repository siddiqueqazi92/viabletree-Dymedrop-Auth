module.exports = {


  friendlyName: 'Get Options',


  description: '',


  inputs: {
    searchFrom: {
      type:'ref',
      defaultsTo: ['name']
    },
    sort: {
      type: 'string',
      required: true
    },
    range: {
      type: 'string',
      required: true
    },
    filter:{
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },

  fn: async function (inputs, exits) {
    sails.log.debug('calling helpers/get-options');
    const findOptions= {};
    const sort = JSON.parse(inputs.sort);
    if(!_.isEmpty(sort)) {
      // sort
      sort[1] = sort[1].toLowerCase() === 'asc'? 'ASC':'DESC';
      findOptions.sort = `${sort[0]} ${sort[1]}`;
    }
    const range = JSON.parse(inputs.range);
    if(!_.isEmpty(range)) {
      const value = range;
      if( (_.isArray(value) && value.length === 2 &&
        _.isNumber(value[0]) && _.isNumber(value[1]) &&
        value[0] !== Infinity && value[0] !== -Infinity &&
        value[1] !== Infinity && value[1] !== -Infinity)){

        findOptions.skip = range[0];
        findOptions.limit = (range[1]+1) - range[0];

      }else{
        findOptions.skip  = 0;
        findOptions.limit = -1;

      }
    }
    const filter = JSON.parse(inputs.filter);
    if(!_.isEmpty(filter) && !_.isUndefined(filter.q)) {
      // filter.title
      findOptions.where = {};
      if ( inputs.searchFrom.length ){
        findOptions.where = {or:[]};
      }
      for(let i=0; i<inputs.searchFrom.length; i++){
        findOptions.where.or.push({[inputs.searchFrom[i]]:{contains:filter.q}});

      }

    }
    return exits.success(findOptions);
  }


};
