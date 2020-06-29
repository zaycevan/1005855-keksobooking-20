'use strict';

(function () {
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterChildren = mapFilter.children;
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  // Блокировка полей ввода
  var disableInput = function (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].setAttribute('disabled', 'disabled');
    }
  };

  // Активация полей ввода
  var enableInput = function (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].removeAttribute('disabled');
    }
  };

  // Активация страницы
  var activatePage = function () {
    window.map.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    enableInput(adFormFieldsets);
    enableInput(mapFilterChildren);
  };

  // Вызовы функций
  disableInput(adFormFieldsets);
  disableInput(mapFilterChildren);

  window.main = {
    activatePage: activatePage
  };

})();
