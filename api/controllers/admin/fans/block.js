const {
    generateRandomString,
    generateEncryptedPassword,
  } = require("../../../util");
  var ejs = require("ejs");
  const moment = require("moment");
  const path = require("path");
  
  module.exports = {
    friendlyName: "Create Fans",
  
    description: "Create Fans on Admin Panel.",
  
    inputs: {
      user: {
        type: "ref",
        required: true,
      },
      id :{
        type : "string",
     },
     blocked :{
        type : "boolean",
        required : true
     }
    },
  
    exits: {
      badRequest: {
        description: "Bad  Request",
        responseType: "badRequest",
      },
    },
  
    fn: async function (inputs, exits) {
     
      try {
      
        sails.log(`Calling Admin/Fans/Block 
                  Time: ${moment().format()}`);

        const users = await User.find({
            where :{
                currentUser : "fan",
                deletedAt :null,
                id : inputs.id
            }            
        });

        if(users.length < 1)
        {
            return exits.success({
                status: false,
                message: "No users found",
              });
        }
        if(inputs.blocked == users[0].is_blocked)
        {
            return exits.success({
                status: false,
                message: "User is already blocked / Active",
              });
        }
        const userUpdate = await User.updateOne({
            id : inputs.id
        }).set({
            is_blocked : inputs.blocked
        })

        if(userUpdate)
        {
            return exits.success({
                status: true,
                data: userUpdate,
                message: "user listed successfully",
              });
        }
        else{
            return exits.success({
                status: false,
                message: "Error occured"
              });
        }
    
        
      } catch (error) {
        return exits.badRequest({
          status: false,
          data: [],
          message: error.message,
        });
      }
    },
  };
  