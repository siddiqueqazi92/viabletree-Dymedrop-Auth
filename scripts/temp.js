module.exports = {


  friendlyName: 'Temp',


  description: 'Temp something.',


  fn: async function () {

    sails.log('Running custom shell script... (`sails run temp`)');
    sails.log.debug(await sails.models.userrequest.find());

  }


};

