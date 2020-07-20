'use strict';

(function () {
  var MAX_SIMILAR_PINS = 5;
  var mapElement = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var pinListElement = document.querySelector('.map__pins');

  // Добавление информации для меток из объявлений
  var adPin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute('style', 'left: ' + (data.location.x - 25) + 'px; top: ' + (data.location.y - 70) + 'px;');
    pinElement.querySelector('img').setAttribute('src', data.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', data.offer.title);

    // Обработка событий нажатия на метку
    pinElement.addEventListener('click', function () {
      inactivePin();
      activatePin(pinElement);
      window.card.render(data);
      document.addEventListener('keydown', window.card.onEscPress);
    });
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        inactivePin();
        activatePin(pinElement);
        window.card.render(data);
        document.addEventListener('keydown', window.card.onEscPress);
      }
    });
    return pinElement;
  };

  // Отрисовка 5 меток на карте
  var renderPins = function (data) {
    removePins();
    var takeNumber = data.length > MAX_SIMILAR_PINS ? MAX_SIMILAR_PINS : data.length;
    for (var i = 0; i < takeNumber; i++) {
      if (data[i].offer) {
        fragment.appendChild(adPin(data[i]));
      }
    }
    pinListElement.appendChild(fragment);
  };

  // Удаление меток с карты
  var removePins = function () {
    var pinElements = mapElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pinElements) {
      for (var i = 0; i < pinElements.length; i++) {
        pinElements[i].remove();
      }
    }
  };

  // Снятие класса .active с метки
  var inactivePin = function () {
    var activatedPinElement = mapElement.querySelector('.map__pin--active');
    if (activatedPinElement) {
      activatedPinElement.classList.remove('map__pin--active');
    }
  };

  // Добавление класса .active на метку
  var activatePin = function (pinElement) {
    pinElement.classList.add('map__pin--active');
  };

  window.pin = {
    render: renderPins,
    remove: removePins,
    inactive: inactivePin
  };
})();
