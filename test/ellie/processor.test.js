/* test/ellie/processor.test.js
 *
 */

const test = require('ava');

test.beforeEach((t) => {
  t.context.Ellie = require('@ellieproject/ellie');
  t.context.PROC_NULL = new t.context.Ellie.Processor('NULL');
});

test('Processor.Clock should be accessible', (t) => {
  t.truthy(t.context.Ellie.Processor.Clock);
});

test('Processor.Error should be accessible', (t) => {
  t.truthy(t.context.Ellie.Processor.Error);
});

test('Processor.Mode should be accessible', (t) => {
  t.truthy(t.context.Ellie.Processor.Mode);
});

test('Processor.Operation should be accessible', (t) => {
  t.truthy(t.context.Ellie.Processor.Operation);
});

test('addInstruction() should be chainable', (t) => {
  let instruction = 0x00;
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  let val = processor.addInstruction(instruction, op);
  t.is(val, processor);
});

test('addInstruction() should addOperation() new Operations', (t) => {
  let instruction = 0x00;
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  let operations = {'NOP': op};
  processor.addInstruction(instruction, op);
  t.deepEqual(processor.operation, operations);
});

test('addInstruction() should reject a repeated instruction', (t) => {
  let instruction = 0x00;
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  processor.addInstruction(instruction, op);
  let err = t.throws(() => {
    processor.addInstruction(instruction, op);
  });
  t.is(err.message, 'Processor NULL already has instruction 0x0');
});

test('addMemory() should be chainable', (t) => {
  let processor = t.context.PROC_NULL;
  let mem = new t.context.Ellie.Memory('ROM', 'Read Only Memory', Uint8Array, 16);
  t.is(processor.addMemory(mem), processor);
});

test('addMemory() should reject repeated operations', (t) => {
  let processor = t.context.PROC_NULL;
  let mem = new t.context.Ellie.Memory('ROM', 'Read Only Memory', Uint8Array, 16);
  processor.addMemory(mem);
  let err = t.throws(() => {
    processor.addMemory(mem);
  });
  t.is(err.message, 'Processor NULL already has memory ROM');
});

test('addMemory() should accept repeat when forced', (t) => {
  let processor = t.context.PROC_NULL;
  let mem = new t.context.Ellie.Memory('ROM', 'Read Only Memory', Uint8Array, 16);
  processor.addMemory(mem);
  t.notThrows(() => {
    processor.addMemory(mem, true);
  });
});

test('addOperation() should be chainable', (t) => {
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  let val = processor.addOperation(op);
  t.is(val, processor);
});

test('addOperation() should assign a processor if null', (t) => {
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  processor.addOperation(op);
  t.is(op.processor, processor);
});

test('addOperation() should reject repeated operations', (t) => {
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  processor.addOperation(op);
  let err = t.throws(() => {
    processor.addOperation(op);
  });
  t.is(err.message, 'Processor NULL already has operation NOP');
});

test('addOperation() should accept repeat when forced', (t) => {
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  processor.addOperation(op);
  t.notThrows(() => {
    processor.addOperation(op, true);
  });
});

test('addOperation() should not reject blank bonded operations', (t) => {
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP');
  let operations = {'NOP': op};
  op.addProcessor(processor);
  processor.addOperation(op);
  t.is(op.processor, processor);
  t.deepEqual(processor.operation, operations);
});

test('addRegister() should be chainable', (t) => {
  let processor = t.context.PROC_NULL;
  let reg = new t.context.Ellie.Register('REG', 'FULL REGISTER NAME', 4);
  t.is(processor.addRegister(reg), processor);
});

test('addRegister() should reject repeated operations', (t) => {
  let processor = t.context.PROC_NULL;
  let reg = new t.context.Ellie.Register('REG', 'FULL REGISTER NAME', 4);
  processor.addRegister(reg);
  let err = t.throws(() => {
    processor.addRegister(reg);
  });
  t.is(err.message, 'Processor NULL already has register REG');
});

test('addRegister() should accept repeat when forced', (t) => {
  let processor = t.context.PROC_NULL;
  let reg = new t.context.Ellie.Register('REG', 'FULL REGISTER NAME', 4);
  processor.addRegister(reg);
  t.notThrows(() => {
    processor.addRegister(reg, true);
  });
});

test('exec() should reject unknown instructions', (t) => {
  let instructionBad = 0x00;
  let processor = t.context.PROC_NULL;
  let err = t.throws(() => {
    processor.exec(instructionBad);
  });
  t.is(err.message, 'Processor NULL missing opcode 0x0');
});

test('exec() should allow a valid instruction', (t) => {
  let instruction = 0x00;
  let doNothing = function*() { return true; };
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP', 'do nothing', doNothing);
  let mode = new t.context.Ellie.Processor.Mode('MODE');
  op.addMode(instruction, mode);
  processor.addOperation(op);
  processor.exec(instruction);
  t.pass();
});

test('exec() should reject an unknown operation', (t) => {
  let instruction = 0x00;
  let doNothing = function*() { return true; };
  let processor = t.context.PROC_NULL;
  let opBad = new t.context.Ellie.Processor.Operation('BAD', 'bad operation', doNothing);
  let opGood = new t.context.Ellie.Processor.Operation('NOP', 'do nothing', doNothing);
  let mode = new t.context.Ellie.Processor.Mode('MODE');
  opGood.addMode(instruction, mode);
  processor.addOperation(opGood);
  let err = t.throws(() => {
    processor.exec(opBad, mode);
  });
  t.is(err.message, 'Processor NULL missing Operation BAD');
});

test('exec() should allow a valid operation + mode', (t) => {
  let instruction = 0x00;
  let doNothing = function*() { return true; };
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP', 'do nothing', doNothing);
  let mode = new t.context.Ellie.Processor.Mode('MODE');
  op.addMode(instruction, mode);
  processor.addOperation(op);
  processor.exec(op, mode);
  t.pass();
});

test('exec() should reject any other parameter type', (t) => {
  let instruction = 0x00;
  let doNothing = function*() { return true; };
  let processor = t.context.PROC_NULL;
  let op = new t.context.Ellie.Processor.Operation('NOP', 'do nothing', doNothing);
  let mode = new t.context.Ellie.Processor.Mode('MODE');
  op.addMode(instruction, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    processor.exec({});
  });
  t.is(err.message, 'Processor NULL cannot exec [object Object]');
});

test.todo('need more ellie processor tests');
