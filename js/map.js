'use strict';

(function () {
  var PIN_SHAPE_COEFFICIENT = 1;
  var MAIN_PIN_HEIGHT = 22;
  var map = document.querySelector('.map');
  var filterContainer = document.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  var pinListElement = document.querySelector('.map__pins');
  var pinMain = pinListElement.querySelector('.map__pin--main');

  // ошибка при получении данных с сервера
  var onError = function (message) {
    return message;
  };

  // успешное получение данных с сервера
  var onSuccess = function (data) {
    renderPins(data);
  };

  // Обработка события нажатия на Главный пин
  pinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      if (map.classList.contains('map--faded')) {
        window.main.activatePage();
        window.form.fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
        window.load(onSuccess, onError);
      }
    }
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (map.classList.contains('map--faded')) {
        window.main.activatePage();
        window.form.fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
        window.load(onSuccess, onError);
      }
    }
  });

  // Отрисовка меток на карте
  var renderPins = function (data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].offer) {
        fragment.appendChild(window.pin.pin(data[i]));
      }
    }
    pinListElement.appendChild(fragment);
  };

  // Отрисовка карточки объявления
  var renderCard = function (data) {
    window.card.closeCard();
    if (data) {
      map.insertBefore(window.card.getCard(data), filterContainer);
    }
  };

  window.map = {
    map: map,
    pinMain: pinMain,
    renderCard: renderCard
  };

})();
