'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
      window.map.renderCard(data);

      document.addEventListener('keydown', window.card.onCardEscPress);
    });

    pinElement.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        inactivePin();
        activatePin(pinElement);
        window.map.renderCard(data);

        document.addEventListener('keydown', window.card.onCardEscPress);
      }
    });

    return pinElement;
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
    inactivePin: inactivePin
  };

})();
