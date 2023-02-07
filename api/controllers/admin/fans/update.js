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
      data: {
        type: "ref",
        required: true,
      },
      id :{
        type : "string",
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
      
        sails.log(`Calling Admin/Fans/Update 
                  Time: ${moment().format()}`);

        const users = await User.find({
            where :{
                currentUser : "fan",
                deletedAt :null,
                id : inputs.id
            }            
        });
        console.log({inputs});
        if(users.length < 1)
        {
            return exits.success({
                status: false,
                message: "No user found",
              });
        }

         
        const obj = {
          first_name : inputs.data.first_name,
          last_name : inputs.data.last_name,
          avatar : inputs.data.avatar,
          email : inputs.data.email,
          image_url : inputs.data.avatar,
          
      };

        let hashPassword;
        if(inputs.data.password)
        {
          const password = inputs.data.password; //await generateRandomString(12)

          hashPassword = await generateEncryptedPassword(password);
          obj.password = hashPassword
        }
        
       
        const updateUser = await User.updateOne({id: inputs.id}).set(obj);

        console.log({updateUser});

        if(updateUser)
        {
            return exits.success({
                status: true,
                data: updateUser,
                message: "user listed successfully",
              });
        }
        else{
            return exits.success({
                status: false,
                message: "error occured",
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
  