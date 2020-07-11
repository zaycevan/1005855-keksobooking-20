'use strict';

(function () {
  var MAX_SIMILAR_PINS = 5;
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var pinListElement = document.querySelector('.map__pins');

  // Добавление информации для меток из объявлений
  var pin = function (data) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.setAttribute('style', 'left: ' + (data.location.x - 25) + 'px; top: ' + (data.location.y - 70) + 'px;');
    pinElement.querySelector('img').setAttribute('src', data.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', data.offer.title);

    // Обработка событий нажатия на метку
    pinElement.addEventListener('click', function () {
      inactivePin();
      activatePin(pinElement);
      window.card.renderCard(data);

      document.addEventListener('keydown', window.card.onCardEscPress);
    });

    pinElement.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        inactivePin();
        activatePin(pinElement);
        window.card.renderCard(data);

        document.addEventListener('keydown', window.card.onCardEscPress);
      }
    });

    return pinElement;
  };

  // Отрисовка 5 меток на карте
  var renderPins = function (data) {
    removePins();
    var takeNumber;
    if (data.length > MAX_SIMILAR_PINS) {
      takeNumber = MAX_SIMILAR_PINS;
    } else {
      takeNumber = data.length;
    }
    for (var i = 0; i < takeNumber; i++) {
      if (data[i].offer) {
        fragment.appendChild(pin(data[i]));
      }
    }
    pinListElement.appendChild(fragment);
  };

  // Удаление меток с карты
  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins) {
      for (var i = 0; i < pins.length; i++) {
        pins[i].remove();
      }
    }
  };

  // Снятие класса .active с метки
  var inactivePin = function () {
    var activePin = window.map.map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // Добавление класса .active на метку
  var activatePin = function (pinElement) {
    pinElement.classList.add('map__pin--active');
  };

  window.pin = {
    pin: pin,
    renderPins: renderPins,
    removePins: removePins,
    inactivePin: inactivePin
  };

})();
