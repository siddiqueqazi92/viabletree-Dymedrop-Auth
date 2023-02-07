module.exports = {
  friendlyName: "Get User Details",

  description: "",

  inputs: {
    id: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "Driver not exists",
    },
    ok: {
      description: "send ok error",
      responseType: "ok",
    },
  },

  fn: async function ({ id }, exits) {
    sails.log.debug("calling users/get-one", id);
    try {
      const _user = await User.findOne({ id });
      sails.log.debug("_user", _user);
      if (_.isNull(_user) || _.isUndefined(_user)) {
        return exits.ok({ status: false, data: [], message: "Invalid User" });
      }
      return exits.success(_user);
    } catch (e) {
      sails.log.error("error get user", e);
      return exits.ok({ status: false, data: [], message: e.message });
    }
  },
};
