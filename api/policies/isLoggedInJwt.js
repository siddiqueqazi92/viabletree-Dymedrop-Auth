const moment = require('moment')
/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: Checks that user is logged in and adds user to input
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = async (req, res, next) => {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.unauthorized({
      status: false,
    });
  }

  let user;

  try {
    user = await sails.helpers.jwt.verifyToken.with({ token });

    const users = await User.find({ id: user.id }).limit(1);
    if (!users.length) {
      sails.log.debug(
        `policy prohibitted isLoggedIn due to user account deleted:user_id: ${user.id}, path: ${req.path} time: ${moment().format()}`
      ); return res.forbidden({
        status: false,
        data: {},
        message: 'Your account has been deleted.',
      });
    }

    if (users[0].is_blocked) {
      sails.log.debug(
        `policy prohibitted isLoggedIn due to isBlocked: ${users[0].is_blocked} user_id: ${users[0].id}, path: ${req.path} time: ${moment().format()}`
      ); return res.forbidden({
        status: false,
        data: {},
        message: 'User is blocked by admin.',
      });
    }
    if (!users[0].is_active) {
      sails.log.debug(
        `policy prohibitted isLoggedIn due to is_active: ${users[0].is_active} user_id: ${users[0].id} path: ${req.path} time: ${moment().format()}`
      ); return res.forbidden({
        status: false,
        data: {},
        message: 'Your account is inactive',        
      });
    }

    if (users[0]) {
      sails.log.debug(
        `policy isLoggedIn user_id: ${users[0].id} path: ${req.path} time: ${moment().format()}`
      );
      req.query.user = users[0];
      return next();
    }
  } catch (e) {
    sails.log.error(e);
    return res.unauthorized({
      status: false,
    });
  }
};
