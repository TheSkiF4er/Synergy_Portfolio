/**
 * Utilities: parsing, formatting, validation.
 */

/**
 * Split by comma/space/semicolon.
 * @param {string} s
 * @returns {string[]}
 */
function splitList(s) {
  return s
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean);
}

/**
 * Parse either a scalar number or an array of numbers.
 * Accepts decimals and negative numbers.
 * @param {string} raw
 * @returns {{kind:'scalar', value:number} | {kind:'array', value:number[]}}
 */
function parseScalarOrArray(raw) {
  const s = (raw ?? '').trim();
  if (s === '') throw new Error('Empty input');

  const tokens = splitList(s);
  const isArray = tokens.length > 1;

  const toNum = (t) => {
    // Normalize comma decimals to dot if user pasted them
    const norm = String(t).replace(',', '.');
    const n = Number.parseFloat(norm);
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${t}`);
    return n;
  };

  if (!isArray) {
    return { kind: 'scalar', value: toNum(tokens[0]) };
  }
  return { kind: 'array', value: tokens.map(toNum) };
}

/**
 * @param {number} n
 * @param {number} decimals
 */
function formatNumber(n, decimals) {
  if (!Number.isFinite(n)) return String(n);
  const d = Math.max(0, Math.min(12, decimals | 0));
  // Trim trailing zeros for nicer output.
  const fixed = n.toFixed(d);
  return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

module.exports = {
  splitList,
  parseScalarOrArray,
  formatNumber
};
