const { formatNumber } = require('./utils');

/**
 * Calculator core logic. UI is separated from operations.
 * Add new operations by extending `operations` map.
 */
class Calculator {
  constructor() {
    /** @type {Record<string, (a:number,b:number)=>number>} */
    this.operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
      },
      '^': (a, b) => {
        // guard against huge exponents producing Infinity
        const r = Math.pow(a, b);
        if (!Number.isFinite(r)) throw new Error('Result is not finite');
        return r;
      },
      '%': (a, b) => (a * b) / 100
    };
  }

  /**
   * Calculate scalar result.
   * @param {number} a
   * @param {string} op
   * @param {number} b
   */
  calc(a, op, b) {
    const fn = this.operations[op];
    if (!fn) throw new Error(`Unknown operation: ${op}`);
    const r = fn(a, b);
    if (!Number.isFinite(r)) throw new Error('Result is not finite');
    return r;
  }

  /**
   * Batch calculation: element-wise with broadcasting.
   * @param {number|number[]} a
   * @param {string} op
   * @param {number|number[]} b
   * @returns {number[]}
   */
  calcBatch(a, op, b) {
    const aIsArr = Array.isArray(a);
    const bIsArr = Array.isArray(b);

    if (!aIsArr && !bIsArr) return [this.calc(a, op, b)];

    const len = aIsArr ? a.length : b.length;
    if (aIsArr && bIsArr && a.length !== b.length) {
      throw new Error('Arrays must have the same length');
    }

    const out = new Array(len);
    for (let i = 0; i < len; i++) {
      const ai = aIsArr ? a[i] : a;
      const bi = bIsArr ? b[i] : b;
      out[i] = this.calc(ai, op, bi);
    }
    return out;
  }

  /**
   * Convenience: format scalar or array results.
   * @param {number|number[]} r
   * @param {number} decimals
   */
  format(r, decimals) {
    if (Array.isArray(r)) return r.map((x) => formatNumber(x, decimals)).join(', ');
    return formatNumber(r, decimals);
  }
}

module.exports = { Calculator };
