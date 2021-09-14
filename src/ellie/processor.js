function Processor(name) {
  this.instruction = {};
  this.memory      = {};
  this.name        = name;
  this.opcode      = {};
  this.register    = {};
  return this;
} // Processor()

Processor.prototype.addOpcode = function(opcode, name=null) {
  this.opcode[name || opcode.name] = opcode;
  opcode.addProcessor(this);
  return this;
}; // Processor.prototype.addOpcode()

Processor.prototype.addInstruction = function(instruction, opcode) {
  if (instruction in this.instruction) {
    throw `Instruction 0x${instruction.toString(16)} already defined for '${this.name}'`;
  } else {
    this.instruction[instruction] = opcode;
  } // if instruction in this.instruction
  return this;
}; // Processor.prototype.addInstruction()

Processor.prototype.addRegister = function(register, name=null) {
  this.register[name || register.name] = register;
  return this;
}; // Processor.prototype.addRegister()

Processor.prototype.addMemory = function(memory, name=null) {
  this.memory[name || memory.name] = memory;
  return this;
}; // Processor.prototype.addMemory()

Processor.prototype.run = function(instruction) {
  if (instruction in this.instruction) {
    this.instruction[instruction].run(instruction, this);
  } else {
    throw `Processor '${this.name}' has no Opcode ${instruction.toString(16)}`;
  }
  return this;
}; // Processor.prototype.run()

module.exports = Processor;
