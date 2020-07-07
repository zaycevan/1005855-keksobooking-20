'use strict';

(function () {
  var CIRCLE_SHAPE_COEFFICIENT = 2;
  var PIN_HEIGHT = 0;
  var map = document.querySelector('.map');
  var pinMain = map.querySelector('.map__pin--main');
  var mapFilter = map.querySelector('.map__filters');
  var mapFilterChildren = mapFilter.children;
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  // Блокировка полей ввода
  var disableInput = function (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].setAttribute('disabled', 'disabled');
    }
  };

  // Блокировка страницы
  var disablePage = function () {
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    mapFilter.reset();
    adForm.reset();
    disableInput(adFormFieldsets);
    disableInput(mapFilterChildren);
    window.card.closeCard();
    window.pin.removePins();
    pinMain.setAttribute('style', 'left: 570px; top: 375px;');
    window.form.fillAddressInput(pinMain, CIRCLE_SHAPE_COEFFICIENT, PIN_HEIGHT);
    window.form.getMinPrice();
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
  disablePage();

  window.main = {
    activatePage: activatePage,
    disablePage: disablePage
  };
})();
