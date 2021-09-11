function Opcode(acronym, description, matchFunction, parseFunction, cycles=0) {
  this.name = acronym;
  this.desc = description;
  this.match = matchFunction;
  this.parse = parseFunction;
  this.cycles = cycles;
} // Opcode()

Opcode.prototype.execute = function(instruction, processor) {
  if (this.match(instruction)) {
    this.parse(instruction, processor);
    // TODO
    // processor.clock.increment(this.cycles);
    return true;
  }
  return false;
}; // Opcode.prototype.execute()

module.exports = Opcode;
