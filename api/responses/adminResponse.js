/**
 * 200 (Request) Handler
 *
 * Usage:
 * return res.adminResponse();
 * return res.adminResponse(data);
 *
 * e.g.:
 * ```
 * return res.adminResponse(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

const { parseLocaleMessage } = require('../util');

module.exports = function badRequest(data, options) {
  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  // sails.log.debug('data', data);
  // Set status code
  res.status(200);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Range', `${data.options.routeName} ${data.options.range[0]}-${data.options.range[1]}/${data.options.count}`);


  return res.json(data.data);

};
