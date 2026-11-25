const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateDeSize,
  calculateUkSize,
  formatSize,
  validateMeasurements,
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

test('validateMeasurements accepts in-range numeric input, including decimals', () => {
  assert.deepEqual(validateMeasurements('80', '93'), {
    valid: true,
    code: null,
    message: null,
    underbust: 80,
    bust: 93,
  });
  assert.equal(validateMeasurements('68.5', '77.2').valid, true);
});

test('validateMeasurements rejects empty input', () => {
  for (const [underbust, bust] of [['', ''], ['80', ''], ['', '93']]) {
    const result = validateMeasurements(underbust, bust);
    assert.equal(result.valid, false);
    assert.equal(result.code, 'required');
    assert.ok(result.message.length > 0);
  }
});

test('validateMeasurements rejects non-numeric and non-positive values', () => {
  assert.equal(validateMeasurements('eighty', '93').code, 'not-a-number');
  assert.equal(validateMeasurements('80', 'ninety three').code, 'not-a-number');
  assert.equal(validateMeasurements('-80', '93').code, 'not-positive');
  assert.equal(validateMeasurements('80', '0').code, 'not-positive');
});

test('validateMeasurements rejects a bust smaller than the underbust', () => {
  const result = validateMeasurements('90', '80');
  assert.equal(result.valid, false);
  assert.equal(result.code, 'bust-smaller');
});

test('validateMeasurements rejects measurements outside the supported bands', () => {
  assert.equal(validateMeasurements('140', '150').code, 'out-of-range');
  assert.equal(validateMeasurements('80', '250').code, 'out-of-range');
});
