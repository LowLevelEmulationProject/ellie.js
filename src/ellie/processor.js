/* ellie/processor.js
 *
 * The Processor is the heart and soul of our emulation. In practical terms,
 * it is a container for an Instruction Set, Operations, their Addressing
 * Modes, and a run() function with some basic logical glue for the ISA.
 *
 * In some sense, everything here could be seen as just syntax sugar,
 * but I hope that undervalues what real utility of this virtual Processor.
 *
 * Although Operations may hold segments of the instuction set, it is the
 * complete instruction set under view of the processor that does the heavy
 * lifting. Even if an Operation or Mode is quite common or generic (i.e.
 * AND, XOR, Indirect Addressing, etc.), an Operation or Mode should be
 * tailor-made to the processor. How else would it know which registers or
 * memory cells to manipulate? General memory banks, though are not intended
 * be bound to a specific Processor, as a CPU and GPU sharing direct memory
 * access could be meaningfully faster than loading this data along a bus.
 *
 * At the time of binding (usually via Processor.addOperation), an Operation
 * will forward all known instructions to the Processor. Additionally, any
 * future runs of Operation.addInstruction will trigger Processor.addInstruction.
 */

function Processor(name) {
  this.instruction = {};
  this.memory      = {};
  this.name        = name;
  this.operation   = {};
  this.register    = {};
  return this;
} // Processor()

Processor.Clock     = require('@ellieproject/ellie/processor/clock');
Processor.Error     = require('@ellieproject/ellie/processor/error');
Processor.Mode      = require('@ellieproject/ellie/processor/mode');
Processor.Operation = require('@ellieproject/ellie/processor/operation');

Processor.prototype.addInstruction = function(code, operation, force=false) {
  if (code in this.instruction && !force) {
    throw new Processor.Error(`Processor ${this.name} already has instruction 0x${code.toString(16)}`);
  }
  if (!(operation.name in this.operation) || force) {
    this.addOperation(operation, force);
  }
  this.instruction[code] = operation;
  return this; // chainable
}; // Processor.prototype.addInstruction()

Processor.prototype.addMemory = function(memory, force=false) {
  if (memory.name in this.memory && !force) {
    throw new Processor.Error(`Processor ${this.name} already has memory ${memory.name}`);
  }
  this.memory[memory.name] = memory;
  return this; // chainable
}; // Processor.prototype.addMemory()

Processor.prototype.addOperation = function(operation, force=false) {
  if (operation.name in this.operation && !force) {
    throw new Processor.Error(`Processor ${this.name} already has operation ${operation.name}`);
  }
  this.operation[operation.name] = operation;
  if (operation.processor === null || force) {
    operation.addProcessor(this, force);
  }
  return this; // chainable
}; // Processor.prototype.addOperation()

Processor.prototype.addRegister = function(register, force=false) {
  if (register.name in this.register && !force) {
    throw new Processor.Error(`Processor ${this.name} already has register ${register.name}`);
  }
  this.register[register.name] = register;
  return this; // chainable
}; // Processor.prototype.addRegister()

Processor.prototype.run = function(codeOrOperation, mode) {
  let code;
  // lookup the opcode, either by code or {Operation, Mode}
  if (typeof codeOrOperation === 'number') { // code
    code = codeOrOperation;
  } else if (codeOrOperation instanceof Processor.Operation) {
    if (codeOrOperation.name in this.operation) {
      let operation = this.operation[codeOrOperation.name];
      code = operation.mode[mode.name]; // if it's invalid, Operation will throw
    } else {
      throw new Processor.Error(`Processor ${this.name} missing Operation ${codeOrOperation.name}`);
    } // if codeOrOperation.name in...
  } else { // neither, err
    throw new Processor.Error(`Processor ${this.name} cannot run ${codeOrOperation}`);
  } // if typeof codeOrOperation

  // run the opcode, if it exists
  if (code in this.instruction) {
    this.instruction[code].run(code, this);
  } else {
    throw new Processor.Error(`Processor ${this.name} missing opcode 0x${code.toString(16)}`);
  }
};

module.exports = Processor;
