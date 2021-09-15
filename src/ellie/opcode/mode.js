/* ellie/opcode/mode.js
 *
 */

function doNothing() {
  return null;
} // doNothing()

function Mode(name, preprocess=doNothing, postprocess=doNothing) {
  this.name = name;
  this.preprocess = preprocess;
  this.postprocess = postprocess;
} // Opcode.Mode()

module.exports = Mode;
