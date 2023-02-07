/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // "*": "authenticated",

  // whitelist the auth controller
  auth: {
    "*": true,
  },

  "admin/users/create": ["isAdmin"],

  "user/logout": ["isLoggedInJwt"],

  "user/accounts/deactivate": ["isLoggedInJwt"],

  "user/edit/profile": ["isLoggedInJwt"],
  "user/get/profile": ["isLoggedInJwt"],
  "user/edit/details": ["isLoggedInJwt"],

  // "user/edit/personal-info": ["isLoggedInJwt"],
  "user/edit/password": ["isLoggedInJwt"],
  "user/edit/email": ["isLoggedInJwt"],
  "user/edit/contact": ["isLoggedInJwt"],
  "user/edit/contact/confirm-otp": ["isLoggedInJwt"],
  "user/verify": ["isLoggedInJwt"],
  "user/creator/verify": ["isLoggedInJwt"],
  "auth/profile-image-upload": ["isLoggedInJwt"],
  "user/edit/fan-details": ["isLoggedInJwt"],

  //ADMIN (FAN)

  "admin/fans/list" : ["isLoggedInJwt"],
  "admin/fans/delete" : ["isLoggedInJwt"],
  "admin/fans/list" : ["isLoggedInJwt"],
  "admin/fans/list-one" : ["isLoggedInJwt"],
  "admin/fans/update" : ["isLoggedInJwt"],
  "admin/fans/block" : ["isLoggedInJwt"],
  

  "users/get": ["isAdmin"],
  //"users/get-one": ["isAdmin"],
  "users/delete": ["isAdmin"],
  "users/bulkdelete": ["isAdmin"],
  //"users/change-status": ["isAdmin"],
  //"users/create": ["isAdmin"],
  //"users/update": ["isAdmin"],
};
