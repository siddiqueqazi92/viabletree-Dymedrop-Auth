module.exports = {


    friendlyName: 'Delete',
  
  
    description: 'Delete users.',
  
  
    inputs: {
      filter: {
        type: 'json',
        required: true
      }
    },
  
  
    exits: {
      invalid: {
        responseType: 'badRequest',
        description: '',
      },
    },
  
  
    fn: async function ({filter}, exits) {
      sails.log.debug('calling users/bulkdelete', filter);
      this.res.setHeader('Access-Control-Allow-Origin', '*');
  
      try {
        //filter = JSON.parse(filter);
        if ( _.isArray(filter.id) ){
          const p = [];
          filter.id.forEach((id,i) => {
            p.push(User.findOne({id}));
          });
          const users = await Promise.all(p);
          if(!users){
            return exits.invalid({status: false, data: [], message: 'Faq Category Not Found.'});
          }else{
            for(let b=0;b<users.length;b++){
              if ( !_.isUndefined(users[b]) ){
                let id = users[b].id;
                await User.destroy({id});
                await Token.destroy({user_id: id});
                sails.log.debug('deleted users'+id);
              }
            }
          }
        }
        this.res.setHeader('Access-Control-Allow-Origin', '*');
        return exits.success({status: true, data: [], message: 'Users Deleted'});
      }catch(e){
        sails.log.error('error users/bulkdelete', e);
        return exits.invalid( e.message || 'Server error: can not delete users');
      }
  
    }
  
  
};