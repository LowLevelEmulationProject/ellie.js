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

test('Memory.Mirror should be accessible', (t) => {
  t.truthy(t.context.Memory.Mirror);
});

test('Memory.Override should be accessible', (t) => {
  t.truthy(t.context.Memory.Override);
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

test('mirror() must add a mirror to this.mirrors', (t) => {
  let mem1   = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let mirror = new t.context.Memory.Mirror(0x00, 0x03, 0x00, 0x10);
  mem1.mirror(mirror);
  t.deepEqual(mem1.mirrors, [mirror]);
});

test('mirror() must add a mirror to this.overrides', (t) => {
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let over = new t.context.Memory.Override(null, null, 0x04);
  mem1.override(over);
  t.deepEqual(mem1.overrides, [over]);
});

test('lookup() must correctly reroute mirrors', (t) => {
  let mem1   = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let mirror = new t.context.Memory.Mirror(0x00, 0x04, 0x04, 0x0C);
  mem1.mirror(mirror);
  t.is(mem1.lookup(0x00), 0x00);
  t.is(mem1.lookup(0x01), 0x01);
  t.is(mem1.lookup(0x02), 0x02);
  t.is(mem1.lookup(0x03), 0x03);
  t.is(mem1.lookup(0x04), 0x00);
  t.is(mem1.lookup(0x05), 0x01);
  t.is(mem1.lookup(0x06), 0x02);
  t.is(mem1.lookup(0x07), 0x03);
});

test('lookup() must correctly return overrides', (t) => {
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let over = new t.context.Memory.Override(null, null, 0x04, 0x10);
  mem1.override(over);
  t.is(mem1.lookup(0x00), 0x00);
  t.is(mem1.lookup(0x01), 0x01);
  t.is(mem1.lookup(0x02), 0x02);
  t.is(mem1.lookup(0x03), 0x03);
  t.is(mem1.lookup(0x04), over);
  t.is(mem1.lookup(0x05), over);
  t.is(mem1.lookup(0x06), over);
  t.is(mem1.lookup(0x07), over);
});

test('get() must return value', (t) => {
  let mem1   = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let mirror = new t.context.Memory.Mirror(0x00, 0x04, 0x00, 0x10);
  mem1.mirror(mirror);
  mem1.data[0x00] = 0xFF;
  t.is(mem1.get(0x00), 0xFF);
  t.is(mem1.get(0x04), 0xFF);
});

test('get() must return override value', (t) => {
  let get  = function(index) { return index; };
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let over = new t.context.Memory.Override(get, null, 0x04, 0x10);
  mem1.override(over);
  mem1.data[0x00] = 0xFF;
  t.is(mem1.get(0x00), 0xFF);
  t.is(mem1.get(0x04), 0x04);
  t.is(mem1.get(0x05), 0x05);
  t.is(mem1.get(0x06), 0x06);
  t.is(mem1.get(0x07), 0x07);
});

test('set() must return this', (t) => {
  let mem1   = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let mirror = new t.context.Memory.Mirror(0x00, 0x04, 0x00, 0x10);
  mem1.mirror(mirror);
  t.is(mem1.set(0x00, 0xFF), mem1);
});

test('set() must set memory', (t) => {
  let mem1   = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let mirror = new t.context.Memory.Mirror(0x00, 0x04, 0x00, 0x10);
  mem1.mirror(mirror);
  mem1.set(0x00, 0xFF);
  t.is(mem1.get(0x00), 0xFF);
  t.is(mem1.get(0x04), 0xFF);
});

test('set() must set via override', (t) => {
  let get  = function(index) { return this[index]; };
  let set  = function(index, val) { return this[index] = val; };
  let mem1 = new t.context.Memory('MEM1', 'Memory Block', Uint8Array, 16);
  let over = new t.context.Memory.Override(get, set, 0x04, 0x10);
  mem1.override(over);
  mem1.set(0x04, 0xFF);
  t.is(mem1.get(0x04), 0xFF);
  t.is(mem1.get(0x05), undefined);
});

test('toString() must return string #1', (t) => {
  let mem = new t.context.Memory('MEM', 'Memory Block', Uint8Array, 8);
  t.is(mem.toString(), '[object Memory Memory Block Uint8Array 8]');
});
