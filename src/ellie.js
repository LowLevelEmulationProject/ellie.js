/* ellie.js
 *
 * access using: @ellieproject/ellie
 */

var Ellie = {
  Memory: require('./ellie/memory.js'),
  Opcode: require('./ellie/opcode.js'),
  Processor: require('./ellie/processor.js'),
  Register: require('./ellie/register.js')
};

module.exports = Ellie;
