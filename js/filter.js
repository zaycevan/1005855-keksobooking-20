'use strict';

(function () {
  var mapFilter = window.map.map.querySelector('.map__filters');
  var housingTypeFilter = mapFilter.querySelector('#housing-type');
  var housingType;
  var housingPriceFilter = mapFilter.querySelector('#housing-price');
  var housingPrice;

  // сортировка объявлений по рейтингу
  var getRank = function (ad) {
    var rank = 0;
    if (ad.offer.type === housingType) {
      rank++;
    }
    if (housingPrice === 'low' && ad.offer.price < 10000) {
      rank++;
    }
    if (housingPrice === 'middle' && ad.offer.price >= 10000 && ad.offer.price < 50000) {
      rank++;
    }
    if (housingPrice === 'high' && ad.offer.price >= 50000) {
      rank++;
    }

    return rank;
  };

  // сортировка объявлений по имени
  var namesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  // фильтрация по типу жилья
  housingTypeFilter.addEventListener('change', function () {
    var newHousingType = housingTypeFilter.options[housingTypeFilter.selectedIndex].value;
    housingType = newHousingType;
    window.card.closeCard();
    window.map.updateAds();
  });

  // фильтрация по цене жилья
  housingPriceFilter.addEventListener('change', function () {
    var newHousingPrice = housingPriceFilter.options[housingPriceFilter.selectedIndex].value;
    housingPrice = newHousingPrice;
    window.card.closeCard();
    window.map.updateAds();
  });

  window.filter = {
    getRank: getRank,
    namesComparator: namesComparator
  };

})();
