/* ellie/memory/error.js
 *
 */

function MemoryError(msg) {
  this.message = msg;
} // Memory.MemoryError

MemoryError.prototype = Object.create(Error.prototype);
MemoryError.prototype.name = 'MemoryError';
MemoryError.prototype.constructor = MemoryError;

module.exports = MemoryError;
