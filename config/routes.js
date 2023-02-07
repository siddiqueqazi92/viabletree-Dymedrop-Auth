/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "GET /": function (req, res) {
    res.send({ status: "Alive" });
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
  "GET /ping": { action: "ping" },

  //ADMIN ROUTES

  'POST /api/v1/admin/fans': 'admin/fans/create',
  'GET /api/v1/admin/fans': 'admin/fans/list',
  'GET /api/v1/admin/fans/:id': 'admin/fans/list-one',
  'DELETE /api/v1/admin/fans/:id': 'admin/fans/delete',
  'PUT /api/v1/admin/fans/:id': 'admin/fans/update',
  'PUT /api/v1/admin/fans/block/:id': 'admin/fans/block',
  // ''


  'POST /api/v1/admin/users': 'admin/users/create',

  'POST /api/v1/admin/login': 'auth/admin/login',
  // Auth

  /**
   * inputs:
   *  - email
   *  - password
   *
   * process:
   *  - check if email exist?
   *    - if email not exist then show error.
   *    - if email exists then proceeds further.
   *  - check if password is correct?
   *    - if password is incorrect then show error.
   *    - if password is correct then proceeds.
   *
   * output:
   *  - success(tokens)/error.
   */
  "POST /api/v1/login": "auth/login",
  /**
   * inputs:
   *  - email
   *  - password
   *
   * process:
   *  - check if email exist?
   *    - if email exists (already registered) then show error.
   *    - if email does not exist then proceeds further.
   *  - check if password criteria is fulfilled?
   *    - if password is not fulfilled then show error.
   *    - if password is fulfilled then proceeds.
   *  - send Otp with expiry.
   *
   * output:
   *  - success/error.
   */
  "POST /api/v1/register": "auth/register",
  /**
   * inputs:
   *  - email
   *
   * process:
   *  - check if email exist in request table
   *    - if email not exist than save email with otp in request table with expiry.
   *    - if email exists than send Otp with expiry.
   *
   * output:
   *  - success/error.
   */
  "POST /api/v1/register/resend-otp": "auth/register/resend-otp",
  /**
   * inputs:
   *  - token
   *
   * process:
   *  - remove token from db
   *
   * output:
   *  - Success
   */
  "/api/v1/logout": { action: "user/logout" },

  // Routes Register
  /**
   * inputs:
   *  - email
   *
   * process:
   *  - check if email exist in request table
   *    - if email not exist than save email with otp in request table with expiry.
   *    - if email exists than send Otp with expiry.
   *
   * output:
   *  - success/error.
   */
  "POST /api/v1/auth/sendOtp": { action: "auth/send-otp" },

  /**
   * It will be used to signup user.
   *
   * inputs:
   *  - email
   *  - image
   *  - name
   *  - password
   *  - otp
   *
   * process:
   *  - check if email exist in request table
   *  - validate request
   *  - create user
   *  - remove user from request table.
   *  - login user
   *
   * output:
   *  - login user and send jwt tokens.
   */
  "POST /api/v1/auth/confirmOtp": { action: "auth/confirm-otp" },
  // ------------------------------------------------------
  /**
   * inputs:
   *  - token
   *
   * process:
   *  - remove token from db
   *
   * output:
   *  - Success
   */
  "POST /api/v1/auth/logout": { action: "auth/signout" },
  /**
   * inputs:
   *  - refresh token
   *
   * process:
   *  - refresh token using refresh token given by client
   *
   * output:
   *  - new token
   */
  "POST /api/v1/auth/refreshToken": { action: "auth/refresh-token" },
  /**
   * inputs:
   *  - refresh token
   *
   * process:
   *  - refresh token discarded in using refresh token given by client
   *  - user is temperorily disabled
   * output:
   *  - 
   */
  // "POST /api/v1/user/accounts/deactivate": { action: "auth/deactivate-account" },
  "POST /api/v1/user/accounts/deactivate": { action: "user/accounts/deactivate" },
  /**
   * inputs:
   *  - email
   *  - pwd
   *
   * process:
   *  - check email and pwd
   *
   * outpus:
   *  - send jwt
   */
  "POST /api/v1/auth/login": { action: "auth/login/local" },

  /**
   * inputs:
   *  - email
   *
   * process:
   *  - check email and send otp
   *
   * outputs:
   *  - success/error
   */
  "POST /api/v1/forget-password": { action: "user/forget-password" },

  /**
   * inputs:
   *  - email
   *  - otp
   *
   * process:
   *  - confirm email and otp
   *  - generate random id and send it in response
   *
   * outputs:
   *  - send random id
   */
  "POST /api/v1/forget-password/confirm": {
    action: "user/forget-password/confirm-otp",
  },
  /**
   * inputs:
   *  - email
   *  - token
   *  - password
   *
   * process:
   *  - confirm email and token
   *  - update encrypted password
   *
   * outputs:
   *  - success/error
   */
  "POST /api/v1/forget-password/change-password": {
    action: "user/forget-password/change-password",
  },

  /**
   * Edit Profile - Change email
   * inputs:
   *  - email
   *
   * process:
   *  - check email for other users
   *  - update email
   *
   * outputs:
   *  - success/error
   */

   "POST /api/v1/user/edit/details": { action: "user/edit/details" },
   "POST /api/v1/user/edit/fan-details": { action: "user/edit/fan-details" },

  /**
   * Edit Profile - Change password
   * inputs:
   *  - password
   *
   * process:
   *  - check current and prev pwd
   *  - update encrypted password
   *
   * outputs:
   *  - success/error
   */
  "POST /api/v1/user/edit/password": { action: "user/edit/password" },
  /**
   * Edit Profile - Change email
   * inputs:
   *  - email
   *
   * process:
   *  - check email for other users
   *  - update email
   *
   * outputs:
   *  - success/error
   */

  "POST /api/v1/user/edit/email": { action: "user/edit/email" },
  /**
   * Edit Profile - Change contact
   * inputs:
   *  - contact
   *
   * process:
   *  - check contact for other users
   *  - update contact
   *
   * outputs:
   *  - success/error
   */
  "POST /api/v1/user/edit/contact": { action: "user/edit/contact" },
  "POST /api/v1/user/edit/contact/confirm-otp": {
    action: "user/edit/contact/confirm-otp",
  },
  /**
   * Edit Personal Info - Update name or dob
   * inputs:
   *  - name
   *  - dob
   *
   * process:
   *  - update name
   *  - update dob
   *
   * outputs:
   *  - success/error
   */
  "POST /api/v1/user/edit/personal-info": { action: "user/edit/personal-info" },
  /**
   * Edit Profile - Update name or image
   * inputs:
   *  - name
   *  - image
   *
   * process:
   *  - if image is provided remove prev image and upload new one.
   *  - update name
   *
   * outputs:
   *  - success/error
   */
  "PUT /api/v1/user/edit/profile": { action: "user/edit/profile" },
  /**
   * Get Profile - Update name or image
   * inputs:   
   *
   * process:     
   *  - get user profile
   *
   * outputs:
   *  - success/error
   */
  "GET /api/v1/user/get/profile": { action: "user/get/profile" },

  // SSO
  // 'POST /auth/login/google': { action: 'auth/login/google' },
  // 'POST /auth/login/facebook': { action: 'auth/login/facebook' },
  // 'POST /auth/login/apple': { action: 'auth/login/apple' },

  // social logins
  "POST /api/v1/social-login": {
    action: "social-login",
  },

  // temp
  // 'GET /api/v1/banner': { action: 'banner/get' }
  "POST /api/v1/user/get": { action: "user/get" },

  "GET /api/v1/users": { action: "users/get" },
  "GET /api/v1/users/:id": { action: "users/get-one" },
  "DELETE /api/v1/users/:id": { action: "users/delete" },
  "DELETE /api/v1/users/bulkdelete": { action: "users/bulkdelete" },
  "PUT /api/v1/users/change-status": { action: "users/change-status" },
  "POST /api/v1/users": { action: "users/create" },
  "PUT /api/v1/users/:id": { action: "users/update" },
  "GET /api/v1/users/:id": { action: "users/get-one" },


  "GET /api/v1/user/verify" :{
    action: "user/verify",
  },

  "POST /api/v1/user/creator/verify" :{
    action: "user/creator/verify",
  },

  "PUT /api/v1/user/profile-image-upload" :{
    action: "auth/profile-image-upload",
  },
  
};
