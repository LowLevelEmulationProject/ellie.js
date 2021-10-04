/* ellie/memory/mirror.js
 *
 */

// TODO: please name these better, jfc
function Mirror(start, size, startMirror, sizeMirror) {
  this.start     = startMirror;
  this.end       = startMirror + sizeMirror;
  this.size      = sizeMirror;
  this.startOrig = start;
  this.endOrig   = start + size;
  this.sizeOrig  = size;
} // Memory.Mirror()

module.exports = Mirror;
