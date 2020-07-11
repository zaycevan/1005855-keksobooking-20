'use strict';

(function () {
  var PIN_SHAPE_COEFFICIENT = 1;
  var MAIN_PIN_HEIGHT = 22;
  var map = document.querySelector('.map');
  var pinListElement = document.querySelector('.map__pins');
  var pinMain = pinListElement.querySelector('.map__pin--main');

  // сортировка объявлений по рейтингу
  var getRank = function (ad) {
    var rank = 0;
    if (ad.offer.type === housingType) {
      rank += 1;
    }
    return rank;
  };

  // сортировка по объявления по имени
  var namesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  // отрисовка отсортированных объявлений
  var housingType;
  var ads = [];

  var updateAds = function () {
    window.pin.renderPins(ads.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      if (rankDiff === 0) {
        rankDiff = namesComparator(left.name, right.name);
      }
      return rankDiff;
    }));
  };

  // фильтрация по типу жилья
  var mapFilter = map.querySelector('.map__filters');
  var housingTypeFilter = mapFilter.querySelector('#housing-type');

  housingTypeFilter.addEventListener('change', function () {
    var newHousingType = housingTypeFilter.options[housingTypeFilter.selectedIndex].value;
    housingType = newHousingType;
    updateAds();
  });

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
    map: map
  };

})();
