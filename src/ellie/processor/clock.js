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

function Clock(processor, speed, count=0) {
  this.processor = processor;
  this.runner    = processor.runTick();
  this.speed     = speed;
  this.count     = count;
  this.inc       = 0;
  this.last      = hrtime();
  this.partners  = [];
  return this;
} // Processor.Clock()

Clock.prototype.runSynchronous = function() {
  let slowest = this;
  let slowestTime = this.count / this.speed;
  while (true) {
    for (let partner in this.partners) {
      let partnerTime = partner.count / partner.speed;
      if (partnerTime < slowestTime) {
        slowest = partner;
        slowestTime = partnerTime;
      } // if slower
    } // for partner in this.partners
    let ret = slowest.runner.next();
    slowestTime = slowest.count / slowest.speed;
    //console.log(`${slowest.processor}\tTick = ${slowest.count}\tTime = ${(slowestTime * 1_000_000_000) >> 0} ns\t${ret}`);
  } // while true
}; // Clock.prototype.runSynchronous()

Clock.prototype.start = function() {
  this.last = hrtime();
  return this.last;
};

Clock.prototype.tick = function*(inc=1) {
  this.inc   += inc;
  this.count += inc;
  for (let i = 0; i < inc; i++) {
    yield i;
  }
  return this;
};

Clock.prototype.log = function() {
  let delta  = hrtime(this.last);
  delta      = 1_000_000_000 * delta[0] + delta[1];
  let avg    = (delta / this.inc) >> 0;
  let real   = (1_000_000_000 / this.speed) >> 0;
  let string = 'Ticked ' + this.inc + ' time(s) in ' + delta + ' ns.\t' +
    'Average = ' + avg + ' ns\t' +
    '100% Sim = ' + real + ' ns\t';
  if (avg <= real) {
    string += '\x1b[32m[PASS]\x1b[0m';
  } else {
    string += '\x1b[31m[FAIL]\x1b[0m';
  }
  // using console.log is a considerable slowdown, consider removing? adding debug mode?
  console.log(string);
  this.inc    = 0;
  this.last   = hrtime();
  return this;
};

module.exports = Clock;
