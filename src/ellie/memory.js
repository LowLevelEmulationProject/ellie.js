/* ellie/memory.js
 *
 * Memory cells are, in practice, a pile of aliases overlaying
 * real "physical" memory. It's not unreasonable to desire both
 * direct memory access in an absolute sense, but also desire to
 * create aliases for a subsection of that memory.
 *
 * When the buffer variable is not used, Memory will
 * generate a ArrayBuffer and attaching it to the TypedArray
 * specified by the format parameter. When the buffer variable
 * is used (and it should be another Memory cell), the ArrayBuffer
 * from the buffer parameter is reused, with a TypedArray view
 * based on the format parameter. The offset parameter, if not
 * given, will create an alias starting at the beginning of the
 * ArrayBuffer.
 */

function Memory(name, description, format, size, buffer=null, offset=0) {
  if (
    typeof name        === 'undefined' ||
    typeof description === 'undefined' ||
    typeof format      === 'undefined' ||
    typeof size        === 'undefined' ) {
    throw new Memory.Error('Memory(name, description, format, size) must be defined');
  }
  this.description = description;
  this.mirrors = [];
  this.name = name;
  this.overrides = [];
  // is this better than assuming that size and offset are in bytes?
  offset *= format.BYTES_PER_ELEMENT;
  size   *= format.BYTES_PER_ELEMENT;
  if (buffer === null) { // no buffer, make one
    buffer = new ArrayBuffer(size);
  } else if (buffer instanceof Memory) {
    buffer = buffer.data.buffer;
  } else if (buffer instanceof ArrayBuffer) {
    // do nothing, buffer is an ArrayBuffer
  } else { // buffer unknown
    throw new Memory.Error(`Memory ${name} cannot interpret buffer "${buffer}"`);
  }
  this.data = new format(buffer, offset, size);
  return this;
} // Memory()

Memory.Error    = require('@ellieproject/ellie/memory/error');
Memory.Mirror   = require('@ellieproject/ellie/memory/mirror');
Memory.Override = require('@ellieproject/ellie/memory/override');

Memory.prototype.mirror = function(mirror) {
  this.mirrors.push(mirror);
}; // Memory.prototype.mirror()

Memory.prototype.override = function(override) {
  this.overrides.push(override);
};

Memory.prototype.lookup = function(index) {
  for (const mirror of this.mirrors) {
    if (index >= mirror.start && index <= mirror.end) {
      // % isn't quite modulus arithmatic
      index = (((index - mirror.start) % mirror.sizeOrig) + mirror.sizeOrig) % mirror.sizeOrig + mirror.startOrig;
    } // if
  } // for mirror of this.mirrors
  for (const override of this.overrides) {
    if (index >= override.start && index <= override.end) {
      index = override;
    } // if
  } // for override of this.overrides
  return index;
}; // Memory.prototype.lookup()

Memory.prototype.get = function(index) {
  let indexReal = this.lookup(index);
  if (indexReal instanceof Memory.Override) {
    return indexReal.get(index);
  } else {
    return this.data[ indexReal ];
  }
}; // Memory.prototype.get()

Memory.prototype.set = function(index, value) {
  let indexReal = this.lookup(index);
  if (indexReal instanceof Memory.Override) {
    indexReal.set(index, value);
  } else {
    this.data[ indexReal ] = value;
  }
  return this;
};

Memory.prototype.toString = function() {
  return `[object Memory ${this.description} ${this.data.constructor.name} ${this.data.length}]`;
}; // Memory.prototype.toString()

module.exports = Memory;
