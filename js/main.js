'use strict';

(function () {
  var MAIN_PIN_CIRCLE_HEIGHT = 62 / 2;
  var MAIN_PIN_CIRCLE_WIDTH = 62;
  var mapElement = document.querySelector('.map');
  var pinMainElement = mapElement.querySelector('.map__pin--main');
  var mapFilterElement = mapElement.querySelector('.map__filters');
  var mapFilterChildren = mapFilterElement.children;
  var adFormElement = document.querySelector('.ad-form');
  var adFormFieldsetElements = adFormElement.querySelectorAll('fieldset');

  // Блокировка полей ввода
  var disableInput = function (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].setAttribute('disabled', 'disabled');
    }
  };

  // Блокировка страницы
  var disablePage = function () {
    if (!mapElement.classList.contains('map--faded')) {
      mapElement.classList.add('map--faded');
    }
    if (!adFormElement.classList.contains('ad-form--disabled')) {
      adFormElement.classList.add('ad-form--disabled');
    }
    mapFilterElement.reset();
    adFormElement.reset();
    window.preview.removeImage();
    window.preview.removeAvatar();
    disableInput(adFormFieldsetElements);
    disableInput(mapFilterChildren);
    window.card.close();
    window.pin.remove();
    pinMainElement.setAttribute('style', 'left: 570px; top: 375px;');
    window.form.fillAddressInput(pinMainElement, MAIN_PIN_CIRCLE_WIDTH, MAIN_PIN_CIRCLE_HEIGHT);
    window.form.getMinPrice();
  };

  // Активация полей ввода
  var enableInput = function (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].removeAttribute('disabled');
    }
  };
  var enableFilter = function () {
    enableInput(mapFilterChildren);
  };

  // Активация страницы
  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    adFormElement.classList.remove('ad-form--disabled');
    enableInput(adFormFieldsetElements);
  };

  // Вызовы функций
  disablePage();

  window.main = {
    activatePage: activatePage,
    disablePage: disablePage,
    enableFilter: enableFilter
  };
})();
