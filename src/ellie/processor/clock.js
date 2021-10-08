/* ellie/processor/clock.js
 * A processor's clock can be used (while debugging) to report data about
 * CPU pacing, etc. In turn, we can use this to find clocks that are running
 * faster or slower than they should, or to synchronize multiple
 * clocked processors within a single simulation.
 *
 * e.g. an Ellie simulation wants to run two coprocessors that need to share
 * data. These processors can be set to different speeds and synchronized,
 * waiting for all processors to reach the same 'virtual time'. 'virtual time'
 * is (CPU tick number / CPU speed). A 4 MHz processor will increment the
 * virtual time by 250 ns with each clock tick. A 1 MHz coprocessor will
 * increment the virtual time by 1000 ns per tick. In synchronized mode,
 * when they desync, the clocks will force the faster one to wait for
 * the slower one. Since the 4 MHz processor requires 4 times as many ticks
 * as the 1 MHz one, it is actually likely that the 4 MHz one will be lagging
 * behind in real time.
 *
 */

const { hrtime } = require('process');

function Clock(speed, count=0) {
  this.speed = speed;
  this.count = BigInt(count);
  this.last  = hrtime.bigint();
  this.partners = [];
  return this;
} // Processor.Clock()

Clock.prototype.start = function() {
  this.last = hrtime.bigint();
  return this;
};

Clock.prototype.tick = function(inc=1) {
  let now     = hrtime.bigint();
  inc         = BigInt(inc);
  let delta   = now - this.last;
  this.last   = now;
  this.count += inc;
  console.log(`Ticked ${inc} time(s) in ${delta} ns.\tAverage = ${delta/inc} ns`);
  return this;
};

module.exports = Clock;
