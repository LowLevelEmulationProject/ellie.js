function Register(name, size, bits=0x0) {
  this.bits      = bits;
  this.name      = name;
  this.namedBits = {}; // a bit may have many aliases
  this.size      = size; // TODO enforce size
  return this;
} // Register()

Register.prototype.bit = function(idx) {
  switch (typeof idx) {
  case 'number':
    // do nothing
    break;
  case 'string':
    if (idx in this.namedBits) {
      idx = this.namedBits[idx];
    } else {
      throw `Register ${name} cannot get bit '${idx}'`;
    }
    break;
  default:
    throw `Register ${name} cannot get bit '${idx}'`;
  }
  return (this.bits >> idx) & 0x1;
}; // Register.prototype.bit()

Register.prototype.bitSet = function(idx, value) {
  this.bits &= ~(0x1 << idx) | (value << idx);
  return this;
};

Register.prototype.nameBit = function(idx, name) {
  this.namedBits[name] = idx;
  return this;
}; // Register.prototype.nameBit()

// TODO: there's got to be a nicer way that .set() and .get()

Register.prototype.set = function(value) { // TODO add mask options
  this.bits = value;
  return this;
}; // Register.prototype.set()

Register.prototype.get = function() {
  return this.bits;
}; // Register.prototype.get()

module.exports = Register;
