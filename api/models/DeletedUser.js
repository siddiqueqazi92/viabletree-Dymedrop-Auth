module.exports = {

  attributes: {
    id: {
      type: "string",
      columnName: "_id",
      autoIncrement: true,
    },
    email: {
      type: "string",
      required: true,
      isEmail: true,
    },
    user_id: {
      type: "string",
      required: true,
    },
  },

};

