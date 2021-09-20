/* ellie/processor/error.js
 *
 */

function ProcessorError(msg) {
  this.message = msg;
} // Processor.Operation.ProcessorError

ProcessorError.prototype = Object.create(Error.prototype);
ProcessorError.prototype.name = 'ProcessorError';
ProcessorError.prototype.constructor = ProcessorError;

module.exports = ProcessorError;
