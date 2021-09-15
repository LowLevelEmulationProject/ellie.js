function Register(name, size, bits=0x0) {
  this.bits      = bits;
  this.name      = name;
  this.namedBits = {}; // a bit may have many aliases
  this.size      = size; // TODO enforce size
  return this;
} // Register()

Register.prototype.bit = function(idx) {
  idx = this.namedBit(idx);
  return (this.bits >> idx) & 0x1;
}; // Register.prototype.bit()

Register.prototype.bitSet = function(idx, value) {
  idx = this.namedBit(idx);
  // clear the bit
  this.bits &= ~(0x1 << idx);
  // set the bit based on value
  this.bits |= (value << idx);
  return this;
};

Register.prototype.nameBit = function(idx, name) {
  this.namedBits[name] = idx;
  return this;
}; // Register.prototype.nameBit()

Register.prototype.namedBit = function (name) {
  switch (typeof name) {
  case 'number':
    // do nothing
    break;
  case 'string':
    if (name in this.namedBits) {
      name = this.namedBits[name];
    } else {
      throw `Register ${this.name} cannot get bit '${name}'`;
    }
    break;
  default:
    throw `Register ${this.name} cannot get bit '${name}'`;
  }
  return name;
}; // Register.prototype.namedBit()

// TODO: there's got to be a nicer way that .set() and .get()

Register.prototype.set = function(value) { // TODO add mask options
  this.bits = value;
  return this;
}; // Register.prototype.set()

Register.prototype.get = function() {
  return this.bits;
}; // Register.prototype.get()

Register.prototype.lpad = function(int, size, pad='0') {
  return (pad.repeat(size) + int).slice(size * -1);
};

Register.prototype.toString = function () {
  return `[object Register 0b${this.lpad(this.bits.toString(2), this.size)} '${this.name}']`;
}; // Register.prototype.toString()

module.exports = Register;
