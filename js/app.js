(function () {
  'use strict';

  function setSize(elementId, countryCode, result) {
    const element = document.getElementById(elementId);
    element.replaceChildren();

    const label = document.createElement('small');
    label.textContent = countryCode;

    element.append(label, ` ${result.band} ${result.cup}`);
  }

  function showError(message) {
    const element = document.getElementById('formError');
    if (!element) {
      return;
    }
    element.textContent = message || '';
    element.hidden = !message;
  }

  function clearSizes() {
    for (const elementId of ['ukSize', 'deSize']) {
      const element = document.getElementById(elementId);
      element.replaceChildren();
      element.append('—');
    }
  }

  function updateSizes() {
    const underbust = document.getElementById('underbust').value;
    const bust = document.getElementById('bust').value;

    const validation = window.BraCalculator.validateMeasurements(underbust, bust);

    if (!validation.valid) {
      showError(validation.message);
      clearSizes();
      return;
    }

    showError(null);
    setSize('ukSize', 'UK', window.BraCalculator.calculateUkSize(validation.underbust, validation.bust));
    setSize('deSize', 'DE', window.BraCalculator.calculateDeSize(validation.underbust, validation.bust));
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('braCalculator').addEventListener('submit', function (event) {
      event.preventDefault();
      updateSizes();
    });
  });
})();
