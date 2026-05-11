(function () {
  'use strict';

  function setSize(elementId, countryCode, result) {
    const element = document.getElementById(elementId);
    element.replaceChildren();

    const label = document.createElement('small');
    label.textContent = countryCode;

    element.append(label, ` ${result.band} ${result.cup}`);
  }

  function updateSizes() {
    const underbust = document.getElementById('underbust').value;
    const bust = document.getElementById('bust').value;

    setSize('ukSize', 'UK', window.BraCalculator.calculateUkSize(underbust, bust));
    setSize('deSize', 'DE', window.BraCalculator.calculateDeSize(underbust, bust));
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('braCalculator').addEventListener('submit', function (event) {
      event.preventDefault();
      updateSizes();
    });
  });
})();
