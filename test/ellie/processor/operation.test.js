/* test/ellie/processor/operation.test.js
 *
 */

const test = require('ava');

test.before((t) => {
  t.context.Processor  = require('@ellieproject/ellie/processor');
});

test.beforeEach((t) => {
  function doTrue() { return true; }
  function doFalse() { return false; }
  t.context.INSTR_GOOD = 0x00;
  t.context.INSTR_BAD  = 0x01;
  // prebaked objects
  t.context.MODE_NOP   = new t.context.Processor.Mode('NOP', 'NOP MODE', doTrue, doTrue);
  t.context.MODE_AFTER_FALSE  = new t.context.Processor.Mode('NOP', 'NOP FALSE AFTER', doTrue, doFalse);
  t.context.MODE_BEFORE_FALSE = new t.context.Processor.Mode('NOP', 'NOP FALSE BEFORE', doFalse, doTrue);
  t.context.OP_FALSE  = new t.context.Processor.Operation('NOP', 'Do nothing', doFalse);
  t.context.OP_NOP    = new t.context.Processor.Operation('NOP', 'Do nothing', doTrue);
  t.context.PROC_NULL = new t.context.Processor('NULL');
  // prebaked "results" to compare against
  // TODO THESE SHOULD BE FROZEN TO PREVENT EDITS
  t.context.MODES             = { 'NOP': t.context.INSTR_GOOD };
  t.context.OP_INSTRUCTIONS   = {};
  t.context.OP_INSTRUCTIONS[t.context.INSTR_GOOD] = t.context.MODE_NOP;
  t.context.PROC_INSTRUCTIONS = {};
  t.context.PROC_INSTRUCTIONS[t.context.INSTR_GOOD] = t.context.OP_NOP;
});

test('Processor.Error should be accessible', (t) => {
  t.truthy(t.context.Processor.Operation.Error);
});

test('addMode() should be chainable', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  t.is(op.addMode(t.context.INSTR_GOOD, mode), op);
});

test('addMode() should alter this.mode', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  t.deepEqual(op.mode, {});
  op.addMode(t.context.INSTR_GOOD, mode);
  t.deepEqual(op.mode, t.context.MODES);
});

test('addMode() should alter this.instruction', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  t.deepEqual(op.instruction, {});
  op.addMode(t.context.INSTR_GOOD, mode);
  t.deepEqual(op.instruction, t.context.OP_INSTRUCTIONS);
});

test('addMode() should reject a repeated instruction', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  let err = t.throws(() => {
    op.addMode(t.context.INSTR_GOOD, mode);
  });
  t.is(err.message, 'Operation NOP already has instruction 0x0');
});

test('addMode() should reject a repeated mode', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  let err = t.throws(() => {
    op.addMode(t.context.INSTR_BAD, mode);
  });
  t.is(err.message, 'Operation NOP already has mode "NOP"');
});

test('addMode() should accept a forced mode', (t) => {
  let op   = t.context.OP_NOP;
  let mode = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  op.addMode(t.context.INSTR_GOOD, mode, true);
  t.pass();
});

test('addMode() should alter processor.instruction after addProcessor()', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_NOP;
  t.deepEqual(processor.instruction, {});
  processor.addOperation(op);
  op.addMode(t.context.INSTR_GOOD, mode);
  t.deepEqual(processor.instruction, t.context.PROC_INSTRUCTIONS);
});

test('addMode() should alter processor.instruction during addProcessor()', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_NOP;
  t.deepEqual(processor.instruction, {});
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  t.deepEqual(processor.instruction, t.context.PROC_INSTRUCTIONS);
});

test('addProcessor() should be chainable', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  t.is(op.addProcessor(processor), op);
});

test('addProcessor() should reject a second processor', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  op.addProcessor(processor);
  let err = t.throws(() => {
    op.addProcessor(processor);
  });
  t.is(err.message, 'Operation NOP already has a Processor');
});

test('run() should be chainable', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  t.is(op.run(t.context.INSTR_GOOD), op);
});

test('run() should reject missing instructions', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(t.context.INSTR_BAD);
  });
  t.is(err.message, 'Operation NOP missing instruction 0x1');
});

test('run() should halt on beforeExecute()', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_BEFORE_FALSE;
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(t.context.INSTR_GOOD);
  });
  t.is(err.message, 'Halting NOP 0x0. beforeExecute() returned false');
});

test('run() should halt on execute()', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_FALSE;
  let mode      = t.context.MODE_NOP;
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(t.context.INSTR_GOOD);
  });
  t.is(err.message, 'Halting NOP 0x0. execute() returned false');
});

test('run() should halt on afterExecute()', (t) => {
  let processor = t.context.PROC_NULL;
  let op        = t.context.OP_NOP;
  let mode      = t.context.MODE_AFTER_FALSE;
  op.addMode(t.context.INSTR_GOOD, mode);
  processor.addOperation(op);
  let err = t.throws(() => {
    op.run(t.context.INSTR_GOOD);
  });
  t.is(err.message, 'Halting NOP 0x0. afterExecute() returned false');
});

test('toString() returns text #1', (t) => {
  t.is(t.context.OP_NOP.toString(), '[object Operation NOP Do nothing]');
});

test('toString() returns text #2', (t) => {
  let op = new t.context.Processor.Operation();
  t.is(op.toString(), '[object Operation undefined undefined]');
});

test.todo('replace t.context.Processor with Ellie');
