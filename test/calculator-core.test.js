const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateDeSize,
  calculateUkSize,
  formatSize,
} = require('../js/calculator-core');

test('calculates the placeholder example in both sizing systems', () => {
  assert.deepEqual(calculateUkSize(80, 93), { band: '34', cup: 'C' });
  assert.deepEqual(calculateDeSize(80, 93), { band: '75', cup: 'C' });
});

test('accepts decimal and string measurements from form inputs', () => {
  assert.deepEqual(calculateUkSize('68.5', '77.2'), { band: '30', cup: 'A' });
  assert.deepEqual(calculateDeSize('68.5', '77.2'), { band: '65', cup: 'A' });
});

test('returns the default legacy result when measurements are missing or outside supported bands', () => {
  assert.deepEqual(calculateUkSize('', ''), { band: 'Oh', cup: 'Oh' });
  assert.deepEqual(calculateDeSize(140, 150), { band: 'Oh', cup: 'Oh' });
});

test('returns the legacy invalid marker when bust is too small or too large for a supported band', () => {
  assert.deepEqual(calculateUkSize(60, 59), { band: 'ò', cup: 'Ô’' });
  assert.deepEqual(calculateDeSize(60, 200), { band: 'ò', cup: 'Ô’' });
});

test('formats calculated sizes for display', () => {
  assert.equal(formatSize('UK', { band: '34', cup: 'C' }), 'UK 34 C');
});
