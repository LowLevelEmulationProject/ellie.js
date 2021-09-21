/* test/ellie/register.test.js
 *
 */

const test = require('ava');

test.beforeEach((t) => {
  t.context.Register = require('@ellieproject/ellie/register');
  t.context.REG_4_0000 = new t.context.Register('REG', 'EMPTY REGISTER NAME', 4, 0b0000);
  t.context.REG_4_1000 = new t.context.Register('REG', '1000 REGISTER NAME', 4, 0b1000);
  t.context.REG_4_1111 = new t.context.Register('REG', '1000 REGISTER NAME', 4, 0b1111);
});

test('Register.Error should be accessible', (t) => {
  t.truthy(t.context.Register.Error);
});

test('Register() must have a name and size', (t) => {
  let err = t.throws(() => {
    new t.context.Register(undefined);
  });
  t.is(err.message, 'Register(acronym, description, size) must be defined');
  t.pass();
});

test('bit() should return 0b1111', (t) => {
  let reg = t.context.REG_4_1111;
  t.is(reg.bit(0), 1);
  t.is(reg.bit(1), 1);
  t.is(reg.bit(2), 1);
  t.is(reg.bit(3), 1);
});

test('bit() should return 0b1000', (t) => {
  let reg = t.context.REG_4_1000;
  t.is(reg.bit(0), 0);
  t.is(reg.bit(1), 0);
  t.is(reg.bit(2), 0);
  t.is(reg.bit(3), 1);
});

test('bit() should reject overflow', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.bit(4, 1);
  });
  t.is(err.message, 'Register REG bit 4 out of range');
});

test('bit() should reject underflow', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.bit(-1, 1);
  });
  t.is(err.message, 'Register REG bit -1 out of range');
});

test('bitSet() should be chainable', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.bitSet(0, 1), reg);
});

test('bitSet() should set a bit', (t) => {
  let reg = t.context.REG_4_0000;
  reg.bitSet(0, 1);
  t.is(reg.bit(0), 1);
  reg.bitSet(1, 1);
  t.is(reg.bit(1), 1);
  reg.bitSet(2, 1);
  t.is(reg.bit(2), 1);
  reg.bitSet(3, 1);
  t.is(reg.bit(3), 1);
});

test('bitSet() should reject overflow', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.bitSet(4, 0);
  });
  t.is(err.message, 'Register REG bit 4 out of range');
});

test('bitSet() should reject underflow', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.bitSet(-1, 0);
  });
  t.is(err.message, 'Register REG bit -1 out of range');
});

test('alias() should be chainable', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.alias(0, 'Z'), reg);
});

test('alias() should alter .aliases', (t) => {
  let reg = t.context.REG_4_0000;
  let aliases = { 'Z': 0 };
  reg.alias(0, 'Z');
  t.deepEqual(reg.aliases, aliases);
});

test('aliasLookup() should find alias string', (t) => {
  let reg = t.context.REG_4_0000;
  reg.alias(0, 'Z');
  t.is(reg.aliasLookup('Z'), 0);
});

test('aliasLookup() should reject objects', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.aliasLookup({});
  });
  t.is(err.message, 'Register REG cannot lookup "[object Object]"');
});

test('aliasLookup() should nonexistant aliases', (t) => {
  let reg = t.context.REG_4_1111;
  let err = t.throws(() => {
    reg.aliasLookup('Z');
  });
  t.is(err.message, 'Register REG has no alias Z');
});

test('load() should be chainable', (t) => {
  let reg1 = t.context.REG_4_0000;
  let reg2 = t.context.REG_4_1111;
  t.is(reg1.load(reg2), reg1);
});

test('load() should copy, but not link, registers', (t) => {
  let reg1 = t.context.REG_4_0000;
  let reg2 = t.context.REG_4_1111;
  reg1.load(reg2);
  t.is(reg1.bits, reg2.bits);
  reg2.set(0b1111);
  t.is(reg1.bits, 0b1111);
});

test('set() should be chainable', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.set(0b1111), reg);
});

test('set() should return .bits #1', (t) => {
  let reg = t.context.REG_4_0000;
  reg.set(0b1111);
  t.is(reg.get(), 0b1111);
});

test('set() should return .bits #2', (t) => {
  let reg = t.context.REG_4_1111;
  reg.set(0b0000);
  t.is(reg.get(), 0b0000);
});

test('get() should return .bits #1', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.get(), 0b0000);
});

test('get() should return .bits #2', (t) => {
  let reg = t.context.REG_4_1111;
  t.is(reg.get(), 0b1111);
});

test('test() should return 1 on a match', (t) => {
  let reg = t.context.REG_4_1111;
  t.is(reg.test(0b1111), 1);
});

test('test() should return 0 without a match', (t) => {
  let reg = t.context.REG_4_1111;
  t.is(reg.test(0b0000), 0);
});

test('wrap() should be chainable', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.wrap(), reg);
});

test('wrap() should fix overflown Registers', (t) => {
  let reg = t.context.REG_4_1111;
  reg.bits += 1; // overflow
  t.is(reg.bits, 0b10000);
  reg.wrap();
  t.is(reg.bits, 0b0);
});

test('wrap() should fix underflown Registers', (t) => {
  let reg = t.context.REG_4_0000;
  reg.bits -= 1; // overflow
  t.is(reg.bits, -1);
  reg.wrap();
  t.is(reg.bits, 0b1111);
});

test('toString() new Register', (t) => {
  let reg = t.context.REG_4_0000;
  t.is(reg.toString(), '[object Register 0b0000 EMPTY REGISTER NAME]');
});

test.todo('need more ellie processor register tests');
