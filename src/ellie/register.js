function Register(acronym, desc, size, bits=0x0) {
  // strongly enforced parameter
  if (typeof acronym === 'undefined' || typeof desc === 'undefined' || typeof size === 'undefined') {
    throw new Register.Error('Register(acronym, description, size) must be defined');
  }
  this.bits        = bits;
  this.description = desc;
  this.name        = acronym;
  this.aliases     = {}; // named aliases for given bits
  this.size        = size;
  this.wrap();
  return this;
} // Register()

Register.Error = require('@ellieproject/ellie/register/error');

// BIT OPERATIONS

Register.prototype.bit = function(idx) {
  idx = this.aliasLookup(idx);
  return (this.bits >> idx) & 0x1;
}; // Register.prototype.bit()

Register.prototype.bitSet = function(idx, value) {
  idx = this.aliasLookup(idx);
  // clear the bit
  this.bits &= ~(0x1 << idx);
  // set the bit based on value
  this.bits |= (value << idx);
  return this;
};

Register.prototype.alias = function(idx, name) {
  this.aliases[name] = idx;
  return this;
}; // Register.prototype.alias()

Register.prototype.aliasLookup = function(name) {
  switch (typeof name) {
  case 'number':
    // do nothing
    break;
  case 'string':
    if (name in this.aliases) {
      name = this.aliases[name];
    } else {
      throw new Register.Error(`Register ${this.name} has no alias ${name}`);
    }
    break;
  default:
    throw new Register.Error(`Register ${this.name} cannot lookup "${name}"`);
  }
  if (name >= this.size || name < 0) {
    throw new Register.Error(`Register ${this.name} bit ${name} out of range`);
  }
  return name;
}; // Register.prototype.aliasLookup()

// REGISTER OPERATIONS

Register.prototype.load = function(other) {
  this.bits = other.bits;
  this.wrap();
  return this;
}; // Register.prototype.load()

// TODO: there's got to be a nicer way that .set() and .get()

Register.prototype.set = function(value) { // TODO add mask options
  this.bits = value;
  this.wrap();
  return this;
}; // Register.prototype.set()

Register.prototype.get = function() {
  return this.bits;
}; // Register.prototype.get()

Register.prototype.test = function(value) {
  return (this.bits === value ? 1 : 0);
}; // Register.prototype.test()

Register.prototype.wrap = function() {
  const mod = 2**this.size;
  this.bits = ((this.bits % mod) + mod) % mod;
  return this;
}; // Register.prototype.wrap()

// STRING & FORMATTING OPERATIONS

Register.prototype.lpad = function(int, size, pad='0') {
  return (pad.repeat(size) + int).slice(size * -1);
};

Register.prototype.toString = function () {
  return `[object Register 0b${this.lpad(this.bits.toString(2), this.size)} ${this.description}]`;
}; // Register.prototype.toString()

module.exports = Register;
