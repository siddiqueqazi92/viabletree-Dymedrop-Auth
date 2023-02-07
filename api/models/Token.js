/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "string",
      columnName: "_id",
      autoIncrement: true,
    },
    token: {
      type: "string",
      unique: true,
      required: true,
    },
    user_id: {
      type: "string",
      unique: true,
      required: true,
    },
  },
};
