/* ellie/processor/operation/error.js
 *
 */

function OperationError(msg) {
  this.message = msg;
} // Processor.Operation.OperationError

OperationError.prototype = Object.create(Error.prototype);
OperationError.prototype.name = 'OperationError';
OperationError.prototype.constructor = OperationError;

module.exports = OperationError;
