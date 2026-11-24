'use strict';

const js = require('@eslint/js');

module.exports = [
  {
    // vendored third-party files
    ignores: ['node_modules/', 'js/bootstrap.min.js', 'js/jquery-2.1.0.min.js']
  },
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'script',
      globals: { $: 'readonly' }
    },
    rules: {
      // The calculator scripts rely on implicit globals for now;
      // tracked in https://github.com/aytvill/bra-calculator/issues/12
      'no-undef': 'off'
    }
  },
  {
    files: ['test/**/*.js', 'eslint.config.js'],
    languageOptions: { sourceType: 'commonjs' }
  }
];
