'use strict';

(function () {
  var PIN_SHAPE_COEFFICIENT = 1;
  var MAIN_PIN_HEIGHT = 22;
  var map = document.querySelector('.map');
  var pinListElement = document.querySelector('.map__pins');
  var pinMain = pinListElement.querySelector('.map__pin--main');

  // отрисовка отсортированных объявлений
  var ads = [];

  var updateAds = function () {
    window.pin.renderPins(ads.sort(function (left, right) {
      var rankDiff = window.filter.getRank(right) - window.filter.getRank(left);
      if (rankDiff === 0) {
        rankDiff = window.filter.namesComparator(left.name, right.name);
      }
      return rankDiff;
    }));
  };

  // успешное получение данных с сервера
  var onSuccess = function (data) {
    ads = data;
    updateAds();
    window.main.enableFilter();
  };

  // ошибка при получении данных с сервера
  var onError = function (message) {
    var errorElement = document.createElement('div');
    errorElement.className = 'error-element';
    errorElement.innerHTML = message;
    errorElement.style = 'position: absolute; z-index: 2;';
    map.before(errorElement);

    document.addEventListener('click', function () {
      if (errorElement) {
        errorElement.remove();
      }
    });
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

  window.map = {
    map: map,
    updateAds: updateAds
  };

})();
