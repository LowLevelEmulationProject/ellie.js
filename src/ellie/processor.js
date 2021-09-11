function Processor() {
  this.register = {};
  this.memory = {};
  this.opcode = {};
} // Processor()

Processor.prototype.addOpcode = function (opcode, name=null) {
  this.opcode[name || opcode.name] = opcode;
}; // Processor.prototype.addOpcode()

Processor.prototype.addRegister = function (register, name=null) {
  this.register[name || register.name] = register;
}; // Processor.prototype.addRegister()

Processor.prototype.addMemory = function(memory, name=null) {
  this.memory[name || memory.name] = memory;
}; // Processor.prototype.addMemory()

module.exports = Processor;
