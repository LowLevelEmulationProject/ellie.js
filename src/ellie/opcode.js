/* ellie/opcode.js
 *
 */

function Opcode(acronym, description, execFunction) {
  this.desc         = description;
  this.execute      = execFunction;
  this.instructions = {};
  this.name         = acronym;
  this.processor    = null;
} // Opcode()

Opcode.Mode = require('./opcode/mode.js');

Opcode.prototype.toString = function() {
  return `[object Opcode ${this.name} ${this.description}]`;
}; // Opcode.prototype.toString()

Opcode.prototype.test = function(op) {
  return (op in this.instructions);
}; // Opcode.prototype.test()

Opcode.prototype.run = function(op, processor) {
  if (this.test(op)) {
    var mode = this.instructions[op];
    mode.preprocess(op, processor);
    this.execute(op, processor);
    return true;
  }
  return false;
}; // Opcode.prototype.run()

Opcode.prototype.addProcessor = function(processor) {
  this.processor = processor;
  for (const instruction in this.instructions) {
    this.processor.addInstruction(instruction, this);
  }
}; // Opcode.prototype.addProcessor()

Opcode.prototype.addAddressingMode = function(instr, mode, force=false) {
  switch (typeof instr) {
  case 'number':
    if (instr in this.instructions && !force) {
      throw `Opcode 0x${instr.toString(16)} already exists for '${this.name}'`;
    } else {
      this.instructions[instr] = mode;
      if (this.processor) {
        this.processor.addInstruction(instr, this);
      } // if this.processor
    } // if instr in this.instructions
    break;
  case 'object': // WARN: hope this is an array
    instr.forEach((number) => { this.addAddressingMode(number, mode); });
    break;
  default:
    console.error(`Cannot add mode '${mode.name}' to ${this}`);
  }
}; // Opcode.prototype.addAddressingMode()

module.exports = Opcode;
