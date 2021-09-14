function Processor(name) {
  this.instruction = {};
  this.memory      = {};
  this.name        = name;
  this.opcode      = {};
  this.register    = {};
} // Processor()

Processor.prototype.addOpcode = function(opcode, name=null) {
  this.opcode[name || opcode.name] = opcode;
  console.log(opcode);
  opcode.addProcessor(this);
}; // Processor.prototype.addOpcode()

Processor.prototype.addInstruction = function(instruction, opcode) {
  if (instruction in this.instruction) {
    throw `Instruction 0x${instruction.toString(16)} already defined for '${this.name}'`;
  } else {
    this.instruction[instruction] = opcode;
  } // if instruction in this.instruction
}; // Processor.prototype.addInstruction()

Processor.prototype.addRegister = function(register, name=null) {
  this.register[name || register.name] = register;
}; // Processor.prototype.addRegister()

Processor.prototype.addMemory = function(memory, name=null) {
  this.memory[name || memory.name] = memory;
}; // Processor.prototype.addMemory()

module.exports = Processor;
