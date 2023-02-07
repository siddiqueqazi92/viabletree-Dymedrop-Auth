const moment = require("moment");
const axios = require("axios")
module.exports = {
  friendlyName: "Confirm otp",

  description: "",

  inputs: {
    email: {
      type: "string",
      required: false,
      isEmail: true,
    },
    contact: {
      type: "ref",
      required: false,
      custom: function (value) {
        return (
          _.isObject(value) &&
          !_.isUndefined(value.country_code) &&
          !_.isUndefined(value.number)
        );
      },
    },
    currentUser: {
      type: "string",
      //required: true,
    },
    invited: {
      type: "boolean",
      //required: true,
    },
    password: {
      type: "string",
      required: false,
    },
    otp: {
      type: "string",
      required: true,
    },
    header :{
      type :"ref"
    }
  },

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "User not exists",
    },
    ok: {
      description: "send ok error",
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    const { contact, email, otp, currentUser } = inputs;
    sails.log.debug("calling confirm-otp", { email, contact, otp }, "\nTime: ", moment().format());
    try {
      const req = this.req;
      const res = this.res;
      let data = null;
      const obj = {};
      let status = "pending"
      if (inputs.password) {
        obj.password = password;
      }
      if (inputs.currentUser) {
        obj.currentUser = currentUser;
        
      }
      if(currentUser == "fan"){
        status = "approved";
      }
      if (inputs.contact) {
        data = await sails.models.userrequest.getByContact(inputs.contact);
        obj.country_code = inputs.contact.country_code;
        obj.contact = inputs.contact.number;
        
      }
      if (inputs.email) {
        data = await sails.models.userrequest.findOne({ email: inputs.email });
        obj.email = inputs.email;
      }
      sails.log.debug("data", data);

      if (!data || data.otp != otp) {
        // throw new Error("Invalid OTP");
        sails.log.error("Error in calling confirm-otp. Error Cause: '!data || data.otp != otp' ", "\nTime: ", moment().format())
        return exits.ok({ status: false, message: "Invalid OTP" });
      }
      if(data.currentUser == "invitee"){
        status = "approved";
      }

      var duration = moment.duration(
        moment.utc().diff(moment.utc(data.otp_generated_at))
      );
      var minutes = duration.asMinutes();
      if (minutes >= 5) {
        // throw new Error("Invalid OTP");
        sails.log.error("Error in calling confirm-otp. Error Cause: 'OTP expired (assigned more than 5 mins ago)' ", "\nTime: ", moment().format())
        return exits.ok({ status: false, message: "Invalid OTP" });
      }
      data.status = status

      console.log({data});
      const user = await User.create(data).fetch();
      if (user) {
        sails.log.debug("confirm-otp executed successfully. Data: ", user, "\nTime: ", moment().format())
        const _user = await sails.helpers.jwt.generateToken.with({ user });
        sails.log.debug({_user})
        
        const gatewayServer = sails.config.GATEWAY_SERVER
        const device_id = inputs.header.device_id

        let options = {
          method : "POST",
          url : gatewayServer + `user/guest/confirm`,
          data  : {
            device_id : device_id,
            user_id : _user.id
          }
        }
        sails.log(options)
        if(inputs.currentUser == "fan")
        {
          const confirm = await axios(options)
          sails.log(confirm.data);
        }

        return res.send({
          status: true,
          message: "OTP confirmed successfully",
          data: _user,
        });
      }
      sails.log.debug("error while registering user at confirm-otp", "\nTime: ", moment().format())
      return res.send({
        status: false,
        message: "unknown server error",
        data: data,
      });
      // req.login(user, (err) => {
      //   if (err) {
      //     return res.badRequest(err);
      //   }
      //   sails.log("User " + user.id + " has logged in");
      //   return res.send({
      //     status: true,
      //     message: "Logged in successfully",
      //     data: user,
      //   });
      // });
    } catch (e) {
      sails.log.error("error registration at confirm-otp. Error: ", e, "\nTime: ", moment().format());
      // const _msg = typeof e !== 'string'? 'Unknown Error' : e;
      return exits.ok({ status: false, data: [], message: e.message });
    }
    // All done.
    return;
  },
};
