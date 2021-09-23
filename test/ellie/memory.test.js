/* test/ellie/memory.test.js
 *
 */

const test = require('ava');

test.beforeEach((t) => {
  t.context.Memory = require('@ellieproject/ellie/memory');
});

test('Memory.Error should be accessible', (t) => {
  t.truthy(t.context.Memory.Error);
});

test('Memory(name...) must be defined', (t) => {
  let err = t.throws(() => {
    new t.context.Memory(undefined);
  });
  t.is(err.message, 'Memory(name, description, format, size) must be defined');
});

test('Memory(...description...) must be defined', (t) => {
  let err = t.throws(() => {
    new t.context.Memory('MEM', undefined);
  });
  t.is(err.message, 'Memory(name, description, format, size) must be defined');
});

test('Memory(...format...) must be defined', (t) => {
  let err = t.throws(() => {
    new t.context.Memory('MEM', 'Memory Block', undefined);
  });
  t.is(err.message, 'Memory(name, description, format, size) must be defined');
});

test('Memory(...size...) must be defined', (t) => {
  let err = t.throws(() => {
    new t.context.Memory('MEM', 'Memory Block', Uint8Array, undefined);
  });
  t.is(err.message, 'Memory(name, description, format, size) must be defined');
});

test('Memory() must create a new buffer if not defined', (t) => {
  let mem = new t.context.Memory('MEM', 'Memory Block', Uint8Array, 8);
  t.is(mem.data.length, 8);
});

test('Memory() must alias a buffer from another Memory', (t) => {
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 8);
  let mem2 = new t.context.Memory('MEM2', 'Memory Block', Uint8Array, 8, mem1, 0);
  t.deepEqual(mem1.data, mem2.data);
  mem1.data[0] = 0xFF;
  t.deepEqual(mem1.data, mem2.data);
});

test('Memory() must alias a buffer from a ArrayBuffer', (t) => {
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 8);
  let mem2 = new t.context.Memory('MEM2', 'Memory Block', Uint8Array, 8, mem1.data.buffer, 0);
  t.deepEqual(mem1.data, mem2.data);
  mem1.data[0] = 0xFF;
  t.deepEqual(mem1.data, mem2.data);
});

test('Memory() must reject something any other buffer', (t) => {
  let err = t.throws(() => {
    new t.context.Memory('MEM', 'Memory Block', Uint8Array, 8, {});
  });
  t.is(err.message, 'Memory MEM cannot interpret buffer "[object Object]"');
});

test('toString() must return string #1', (t) => {
  let mem = new t.context.Memory('MEM', 'Memory Block', Uint8Array, 8);
  t.is(mem.toString(), '[object Memory Memory Block Uint8Array 8]');
});
