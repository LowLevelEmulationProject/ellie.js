/* ellie/memory/override.js
 *
 * An Override is a simple tool for memory maps. Sometimes,
 * memory maps will allow for direct register access,
 * or other forms of DMA. Whenever a memory map requires DMA
 * to redirect to another component of the emulation,
 * an Override will allow them to execute code instead of
 * looking at a cell in memory.
 */

function Override(get, set, start, size=0) {
  this.get   = get;
  this.set   = set;
  this.start = start;
  this.end   = start + size;
  return this;
} // Memory.Override()

module.exports = Override;
