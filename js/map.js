'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_WIDTH = 62;
  var mapElement = document.querySelector('.map');
  var pinListElement = document.querySelector('.map__pins');
  var pinMainElement = pinListElement.querySelector('.map__pin--main');
  var ads = [];

  // отрисовка отсортированных объявлений
  var updateAds = function () {
    window.card.close();
    window.filter.getNumberSelected();
    var filteredAds = ads.filter(window.filter.compareRank);
    var sortedAds = filteredAds.sort(function (left, right) {
      var rankDiff = window.filter.getRank(right) - window.filter.getRank(left);
      if (rankDiff === 0) {
        rankDiff = window.filter.namesComparator(left.offer.title, right.offer.title);
      }
      return rankDiff;
    });
    window.pin.render(sortedAds);
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
    mapElement.before(errorElement);
    document.addEventListener('click', function () {
      if (errorElement) {
        errorElement.remove();
      }
    });
  };

  // Обработка события нажатия на Главный пин
  pinMainElement.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      if (mapElement.classList.contains('map--faded')) {
        window.main.activatePage();
        window.form.fillAddressInput(pinMainElement, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
        window.load(onSuccess, onError);
      }
    }
  });
  pinMainElement.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (mapElement.classList.contains('map--faded')) {
        window.main.activatePage();
        window.form.fillAddressInput(pinMainElement, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
        window.load(onSuccess, onError);
      }
    }
  });

  window.map = {
    updateAds: updateAds
  };
})();
