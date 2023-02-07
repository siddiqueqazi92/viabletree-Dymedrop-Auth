module.exports = {
  friendlyName: "Change user status",

  description: "Get user.",

  inputs: {
    user_id: {
      type: "string",
      required: true,
    },
    is_blocked: {
      type: "boolean",
      required: true,
    },
  },

  exits: {
    invalid: {
      responseType: "badRequest",
    },
    unauthorized: {
      responseType: "unauthorized",
    },
    forbidden: {
      responseType: "forbidden",
    },
    serverError: {
      responseType: "serverError",
    },
    ok: {
      responseType: "ok",
    },
    created: {
      responseType: "created",
    },
  },

  fn: async function (inputs, exits) {
    sails.log.debug(
      "Running users/change-status.js with inputs " + JSON.stringify(inputs)
    );
    try {
      let where = { id: inputs.user_id };

      let user = await User.findOne({
        where: where,
        select: ["is_blocked"],
      });

      if (!user) {
        return exits.ok({
          status: false,
          message: "Invalid user id",
          data: [],
        });
      }
      await User.updateOne(where).set({ is_blocked: inputs.is_blocked });
      return exits.created({
        status: true,
        message: "Status changed successfully",
        data: [],
      });
    } catch (err) {
      sails.log.error("error calling users/change-status.js", err.message);
      if (
        !_.isUndefined(err.response) &&
        !_.isUndefined(err.response.data) &&
        !_.isUndefined(err.response.status)
      ) {
        let [exitsName, responseData] = await sails.helpers.response.with({
          status: err.response.status,
          data: err.response.data,
        });
        return exits[exitsName](responseData);
      }
      return exits.serverError({
        status: false,
        data: [],
        message: "Unknown server error.",
      });
    }
  },
};
