/* ellie/opcode/mode.js
 *
 */

function doNothing() {
  return true;
} // doNothing()

function Mode(name, preexecute=doNothing, postexecute=doNothing) {
  this.name = name;
  this.preexecute = preexecute;
  this.postexecute = postexecute;
} // Opcode.Mode()

module.exports = Mode;
