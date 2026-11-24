'use strict';

// Tests for the browser calculator scripts (js/uk_calculator.js and
// js/de_calculator.js). The scripts are plain jQuery scripts, so we load
// them into a vm sandbox with a minimal fake jQuery and simulate a click
// on #calc, then check what they write into #ukSize / #deSize.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const JS_DIR = path.join(__dirname, '..', 'js');

function createHarness() {
  const inputs = { '#underbust': '', '#bust': '' };
  const outputs = {};
  const clickHandlers = [];
  const documentObj = {};

  function $(sel) {
    if (sel === documentObj) {
      // $(document).ready(fn) — run immediately
      return { ready: (fn) => fn() };
    }
    return {
      click: (fn) => { clickHandlers.push(fn); },
      val: () => (sel in inputs ? inputs[sel] : ''),
      html: (value) => { outputs[sel] = value; }
    };
  }

  const sandbox = { $, document: documentObj, console };
  vm.createContext(sandbox);
  for (const file of ['uk_calculator.js', 'de_calculator.js']) {
    const code = fs.readFileSync(path.join(JS_DIR, file), 'utf8');
    vm.runInContext(code, sandbox, { filename: file });
  }

  return function calculate(underbust, bust) {
    inputs['#underbust'] = String(underbust);
    inputs['#bust'] = String(bust);
    for (const fn of clickHandlers) fn();
    return { uk: outputs['#ukSize'], de: outputs['#deSize'] };
  };
}

// [underbust cm, bust cm, expected #ukSize html, expected #deSize html]
const cases = [
  [80, 93, '<small>UK</small> 34 D', '<small>DE</small> 75 C'],
  [63, 70, '<small>UK</small> 28 AA', '<small>DE</small> 60 AAA'],
  [68, 81, '<small>UK</small> 30 C', '<small>DE</small> 65 B'],
  [93, 105, '<small>UK</small> 38 D', '<small>DE</small> 85 D']
];

for (const [underbust, bust, expectedUk, expectedDe] of cases) {
  test(`underbust ${underbust} cm / bust ${bust} cm -> ${expectedUk} / ${expectedDe}`, () => {
    const calculate = createHarness();
    const result = calculate(underbust, bust);
    assert.equal(result.uk, expectedUk);
    assert.equal(result.de, expectedDe);
  });
}
