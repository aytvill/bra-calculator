(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BraCalculator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const INVALID_RESULT = Object.freeze({ band: 'ò', cup: 'Ô’' });
  const DEFAULT_RESULT = Object.freeze({ band: 'Oh', cup: 'Oh' });

  const UK_CUPS = Object.freeze([
    'AAA', 'AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG',
    'H', 'HH', 'J', 'JJ', 'K', 'KK', 'L', 'LL', 'M', 'MM', 'N',
  ]);

  const DE_CUPS = Object.freeze([
    'AAA', 'AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ]);

  const UK_THRESHOLDS = Object.freeze([
    0, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28,
    31, 33, 36, 38, 41, 43, 46, 48, 51, 53, 56, 58,
  ]);

  const DE_THRESHOLDS = Object.freeze([
    0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28,
    30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56,
  ]);

  const UK_BANDS = Object.freeze([
    { min: 58, max: 63, band: '26', thresholdStart: 59 },
    { min: 63, max: 68, band: '28', thresholdStart: 65 },
    { min: 68, max: 73, band: '30', thresholdStart: 70 },
    { min: 73, max: 78, band: '32', thresholdStart: 75 },
    { min: 78, max: 83, band: '34', thresholdStart: 80 },
    { min: 83, max: 88, band: '34', thresholdStart: 80 },
    { min: 88, max: 93, band: '36', thresholdStart: 85 },
    { min: 93, max: 98, band: '38', thresholdStart: 90 },
    { min: 98, max: 103, band: '40', thresholdStart: 95 },
    { min: 103, max: 108, band: '42', thresholdStart: 100 },
    { min: 108, max: 113, band: '44', thresholdStart: 105 },
    { min: 113, max: 118, band: '46', thresholdStart: 110 },
    { min: 118, max: 123, band: '46', thresholdStart: 110 },
    { min: 123, max: 128, band: '48', thresholdStart: 115 },
    { min: 128, max: 133, band: '52', thresholdStart: 125 },
  ]);

  const DE_BANDS = Object.freeze([
    { min: 58, max: 63, band: '55', thresholdStart: 63 },
    { min: 63, max: 68, band: '60', thresholdStart: 68 },
    { min: 68, max: 73, band: '65', thresholdStart: 73 },
    { min: 73, max: 78, band: '70', thresholdStart: 78 },
    { min: 78, max: 83, band: '75', thresholdStart: 83 },
    { min: 83, max: 88, band: '75', thresholdStart: 83 },
    { min: 88, max: 93, band: '80', thresholdStart: 88 },
    { min: 93, max: 98, band: '85', thresholdStart: 93 },
    { min: 98, max: 103, band: '90', thresholdStart: 98 },
    { min: 103, max: 108, band: '95', thresholdStart: 103 },
    { min: 108, max: 113, band: '100', thresholdStart: 108 },
    { min: 113, max: 118, band: '105', thresholdStart: 113 },
    { min: 118, max: 123, band: '105', thresholdStart: 113 },
    { min: 123, max: 128, band: '110', thresholdStart: 118 },
    { min: 128, max: 133, band: '120', thresholdStart: 128 },
  ]);

  function toMeasurement(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function formatSize(countryCode, result) {
    return `${countryCode} ${result.band} ${result.cup}`;
  }

  function findBand(underbust, bands) {
    return bands.find(({ min, max }) => underbust >= min && underbust < max);
  }

  function calculateFromScale(underbust, bust, bands, cups, thresholds) {
    const normalizedUnderbust = toMeasurement(underbust);
    const normalizedBust = toMeasurement(bust);

    if (!Number.isFinite(normalizedUnderbust) || !Number.isFinite(normalizedBust)) {
      return { ...DEFAULT_RESULT };
    }

    const band = findBand(normalizedUnderbust, bands);
    if (!band) {
      return { ...DEFAULT_RESULT };
    }

    const thresholdIndex = thresholds.findIndex(
      (offset) => normalizedBust <= band.thresholdStart + offset,
    );

    if (thresholdIndex <= 0) {
      return { ...INVALID_RESULT };
    }

    return {
      band: band.band,
      cup: cups[thresholdIndex - 1],
    };
  }

  function calculateUkSize(underbust, bust) {
    return calculateFromScale(underbust, bust, UK_BANDS, UK_CUPS, UK_THRESHOLDS);
  }

  function calculateDeSize(underbust, bust) {
    return calculateFromScale(underbust, bust, DE_BANDS, DE_CUPS, DE_THRESHOLDS);
  }

  return {
    calculateDeSize,
    calculateUkSize,
    formatSize,
  };
});
