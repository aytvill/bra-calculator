const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class FakeElement {
  constructor(id, value = '') {
    this.id = id;
    this.value = value;
    this.children = [];
    this.listeners = new Map();
    this.textContent = '';
    this.hidden = false;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatchEvent(type, event) {
    this.listeners.get(type)(event);
  }

  replaceChildren() {
    this.children = [];
    this.textContent = '';
  }

  append(...nodes) {
    this.children.push(...nodes);
    this.textContent += nodes.map((node) => (
      typeof node === 'string' ? node : node.textContent
    )).join('');
  }
}

function loadApplication() {
  const elements = {
    braCalculator: new FakeElement('braCalculator'),
    underbust: new FakeElement('underbust', '80'),
    bust: new FakeElement('bust', '93'),
    ukSize: new FakeElement('ukSize'),
    deSize: new FakeElement('deSize'),
    formError: new FakeElement('formError'),
  };

  const document = {
    listeners: new Map(),
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    },
    createElement() {
      return new FakeElement();
    },
    getElementById(id) {
      return elements[id];
    },
  };

  const context = vm.createContext({
    document,
    window: {},
    self: {},
  });

  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '../js/calculator-core.js'), 'utf8'),
    context,
  );
  context.window.BraCalculator = context.self.BraCalculator;

  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8'),
    context,
  );

  document.listeners.get('DOMContentLoaded')();

  return { elements };
}

test('updates both calculator results when the form is submitted', () => {
  const { elements } = loadApplication();
  let prevented = false;

  elements.braCalculator.dispatchEvent('submit', {
    preventDefault() {
      prevented = true;
    },
  });

  assert.equal(prevented, true);
  assert.equal(elements.ukSize.textContent, 'UK 34 C');
  assert.equal(elements.deSize.textContent, 'DE 75 C');
  assert.equal(elements.formError.hidden, true);
});

test('shows an error and clears the results for invalid measurements', () => {
  const { elements } = loadApplication();
  elements.underbust.value = '90';
  elements.bust.value = '80';

  elements.braCalculator.dispatchEvent('submit', { preventDefault() {} });

  assert.equal(elements.formError.hidden, false);
  assert.equal(
    elements.formError.textContent,
    'The bust measurement must be at least as large as the underbust measurement.',
  );
  assert.equal(elements.ukSize.textContent, '—');
  assert.equal(elements.deSize.textContent, '—');
});
