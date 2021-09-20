/* ellie/register/error.js
 *
 */

function RegisterError(msg) {
  this.message = msg;
} // Register.RegisterError

RegisterError.prototype = Object.create(Error.prototype);
RegisterError.prototype.name = 'RegisterError';
RegisterError.prototype.constructor = RegisterError;

module.exports = RegisterError;
