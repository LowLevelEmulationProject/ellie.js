/* test/ellie/processor/operation.test.js
 *
 */

const test = require('ava');

test.beforeEach((t) => {
  t.context.Processor = require('@ellieproject/ellie/processor');
});

test('Processor.Error should be accessible', (t) => {
  t.truthy(t.context.Processor.Operation.Error);
});

test('addMode() should be chainable', (t) => {
  let instruction = 0x00;
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  let val = op.addMode(instruction, mode);
  t.is(val, op);
});

test('addMode() should alter this.mode', (t) => {
  let instruction = 0x00;
  let modeAfter = {'NOP MODE': instruction};
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  t.deepEqual(op.mode, {});
  op.addMode(instruction, mode);
  t.deepEqual(op.mode, modeAfter);
});

test('addMode() should alter this.instruction', (t) => {
  let instruction = 0x00;
  let instructionAfter = {};
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  instructionAfter[instruction] = mode;
  t.deepEqual(op.instruction, {});
  op.addMode(instruction, mode);
  t.deepEqual(op.instruction, instructionAfter);
});

test('addMode() should reject a repeated instruction', (t) => {
  let instruction = 0x00;
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  op.addMode(instruction, mode);
  let err = t.throws(() => {
    op.addMode(instruction, mode);
  });
  t.is(err.message, 'Operation NOP already has instruction 0x0');
});

test('addMode() should reject a repeated mode', (t) => {
  let instruction1 = 0x00;
  let instruction2 = 0x01;
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  op.addMode(instruction1, mode);
  let err = t.throws(() => {
    op.addMode(instruction2, mode);
  });
  t.is(err.message, 'Operation NOP already has mode "NOP MODE"');
});

test('addMode() should accept a forced mode', (t) => {
  let instruction = 0x00;
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  op.addMode(instruction, mode);
  op.addMode(instruction, mode, true);
  t.pass();
});

test('addMode() should alter processor.instruction after addProcessor()', (t) => {
  let instruction = 0x00;
  let instructionAfter = {};
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  instructionAfter[instruction] = op;
  t.deepEqual(processor.instruction, {});
  processor.addOperation(op);
  op.addMode(instruction, mode);
  t.deepEqual(processor.instruction, instructionAfter);
});

test('addMode() should alter processor.instruction during addProcessor()', (t) => {
  let instruction = 0x00;
  let instructionAfter = {};
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let mode = new t.context.Processor.Mode('NOP MODE');
  instructionAfter[instruction] = op;
  t.deepEqual(processor.instruction, {});
  op.addMode(instruction, mode);
  processor.addOperation(op);
  t.deepEqual(processor.instruction, instructionAfter);
});

test('addProcessor() should be chainable', (t) => {
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  let val = op.addProcessor(processor);
  t.is(val, op);
});

test('addProcessor() should reject a second processor', (t) => {
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  op.addProcessor(processor);
  let err = t.throws(() => {
    op.addProcessor(processor);
  });
  t.is(err.message, 'Operation NOP already has a Processor');
});

test('run() should be chainable', (t) => {
  let instruction = 0x00;
  let doNothing = function() { return true; };
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing', doNothing);
  let mode = new t.context.Processor.Mode('NOP MODE');
  op.addMode(instruction, mode);
  processor.addOperation(op);
  t.is(op.run(instruction), op);
});

test('run() should reject missing instructions', (t) => {
  let instruction = 0x00;
  let instructionBad = 0x01;
  let doNothing = function() { return true; };
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing', doNothing);
  let mode = new t.context.Processor.Mode('NOP MODE');
  op.addMode(instruction, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(instructionBad);
  });
  t.is(err.message, 'Operation NOP missing instruction 0x1');
});

test('run() should halt on beforeExecute()', (t) => {
  let instruction = 0x00;
  let doNothing = function() { return true; };
  let doNothingFalse = function() { return false; };
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing', doNothing);
  let mode = new t.context.Processor.Mode('NOP MODE', doNothingFalse, doNothing);
  op.addMode(instruction, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(instruction);
  });
  t.is(err.message, 'Halting NOP 0x0. beforeExecute() returned false');
});

test('run() should halt on execute()', (t) => {
  let instruction = 0x00;
  let doNothing = function() { return true; };
  let doNothingFalse = function() { return false; };
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing', doNothingFalse);
  let mode = new t.context.Processor.Mode('NOP MODE', doNothing, doNothing);
  op.addMode(instruction, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(instruction);
  });
  t.is(err.message, 'Halting NOP 0x0. execute() returned false');
});

test('run() should halt on afterExecute()', (t) => {
  let instruction = 0x00;
  let doNothing = function() { return true; };
  let doNothingFalse = function() { return false; };
  let processor = new t.context.Processor('NULL');
  let op = new t.context.Processor.Operation('NOP', 'Do nothing', doNothing);
  let mode = new t.context.Processor.Mode('NOP MODE', doNothing, doNothingFalse);
  op.addMode(instruction, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(instruction);
  });
  t.is(err.message, 'Halting NOP 0x0. afterExecute() returned false');
});

test('toString() returns text #1', (t) => {
  let op = new t.context.Processor.Operation('NOP', 'Do nothing');
  t.is(op.toString(), '[object Operation NOP Do nothing]');
});

test('toString() returns text #2', (t) => {
  let op = new t.context.Processor.Operation();
  t.is(op.toString(), '[object Operation undefined undefined]');
});

test.todo('replace t.context.Processor with Ellie');
