module.exports = {
    friendlyName: "GET Verified User",
  
    description: "GET Verified User",
  
    inputs: {
      user: {
        type: "ref",
      },
      
    },
  
    exits: {},
  
    fn: async function (inputs, exits) {
      try {
        sails.log("call user/verify ");
        const id = inputs.user.id
        const getVerified = await sails.models.user.find({id});
        if(getVerified.length > 0){
          if(getVerified[0].status == 'approved'){
            return exits.success({
              status: true,
              message: "User is verified",
              data: {},
            });

          }else{
            return exits.success({
              status: false,
              message: "User is not verified",
              data: {},
            });
          }
            
        }
       
      } catch (err) {
        sails.log.debug(err)
        return exits.success({
          status: false,
          message: error,
          data: {},
        });
      }
    },
  };
  