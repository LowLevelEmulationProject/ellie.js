/* ellie/processor/operation.js
 *
 * Operations are the core of an opcode (operation code)
 * and the heart of a Processor's Instruction Set.
 * When paired with Addressing Modes, they allow for a simple
 * callback structure:
 * - Mode.beforeExecute()
 * - Operation.execute()
 * - Mode.afterExecute()
 *
 * An operation should not generally deal with fetching memory
 * or storing data - allow your modes to handle this. We can think
 * of operations' execute() function in the way that ALU operations
 * work on real hardware. We take from one (or more) known registers
 * and generate an output into a known register.
 *
 * Aliasing? Addressing? Indexing? Let your modes handle that...
 *
 * Example: The AND operation ANDs the accumulator with another
 * register. Depending on the mode, this could be a register
 * within the processor, a memory address, or an immediate integer.
 * The *only* job of the operator is to execute the AND and
 * return the result. It is the job of a mode to set the other
 * input register via before() and store the result from
 * the output register via after(). Since a processor's
 * instruction set often has many operations with similar
 * addressing modes, this makes the mode reusable across
 * operations and minimizes the complexity of the operation
 * itself.
 *
 * Additionally, modes and opcodes are registered with the operation.
 * If an operation detects collisions in opcodes, or that the same
 * mode has been used twice, it will fail out during initialization.
 * When attached to a processor (what use is an operation without
 * a processor and its registers or memory to manipulate?), the
 * operation will pass along any newly registered opcodes.
 * The processor, in turn, will also ensure that there is no collision
 * among registered opcodes or (operation, mode) pairs.
 */

function Operation(acronym, desc, execute) {
  this.description = desc;    // '"AND" A with Memory'
  this.execute     = execute; // function execute()
  this.instruction = {};      // 0xFF => [object Mode]
  this.mode        = {};      // 'IMPLIED' => 0xFF
  this.name        = acronym; // 'AND'
  this.processor   = null;    // [object Processor]
  return this;
} // Processor.Operation()

Operation.Error = require('@ellieproject/ellie/processor/operation/error');

Operation.prototype.addMode = function(code, mode, force=false) {
  if (code in this.instruction && !force) {
    throw new Operation.Error(`Operation ${this.name} already has instruction 0x${code.toString(16)}`);
  } else if (mode.name in this.mode && !force) {
    throw new Operation.Error(`Operation ${this.name} already has mode "${mode.name}"`);
  } else {
    this.mode[mode.name] = code;
    this.instruction[code]      = mode;
    if (this.processor) {
      this.processor.addInstruction(code, this, force);
    } // if this.processor
  } // if code in this.instruction
  return this; // chainable
}; // Operation.prototype.addMode()

Operation.prototype.addProcessor = function(processor, force=false) {
  if (this.processor !== null && !force) {
    throw new Operation.Error(`Operation ${this.name} already has a Processor`);
  } // if processor !== null
  this.processor = processor;
  for (const code in this.instruction) {
    processor.addInstruction(code, this);
  }
  return this; // chainable
}; // Operation.prototype.addProcessor()

Operation.prototype.run = function(code, processor) {
  let mode = this.instruction[code];
  let cont = true;
  if (!(code in this.instruction)) {
    throw new Operation.Error(`Operation ${this.name} missing instruction 0x${code.toString(16)}`);
  } // if !code in this.instruction

  cont = mode.beforeExecute(processor);
  if (cont !== true) {
    throw new Operation.Error(`Halting ${this.name} 0x${code.toString(16)}. beforeExecute() returned ${cont}`);
  }
  cont = this.execute(processor);
  if (cont !== true) {
    throw new Operation.Error(`Halting ${this.name} 0x${code.toString(16)}. execute() returned ${cont}`);
  }
  cont = mode.afterExecute(processor);
  if (cont !== true) {
    throw new Operation.Error(`Halting ${this.name} 0x${code.toString(16)}. afterExecute() returned ${cont}`);
  }
  return this; // chainable
}; // Operation.prototype.run()

Operation.prototype.toString = function() {
  return `[object Operation ${this.name} ${this.description}]`;
}; // Operation.prototype.toString()

module.exports = Operation;
