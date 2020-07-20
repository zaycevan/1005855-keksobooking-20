'use strict';

(function () {
  var mapFilterElement = document.querySelector('.map__filters');
  var mapFilterChildren = mapFilterElement.children;
  var housingTypeFilterElement = mapFilterElement.querySelector('#housing-type');
  var housingType;
  var housingPriceFilterElement = mapFilterElement.querySelector('#housing-price');
  var housingPrice;
  var housingRoomsFilterElement = mapFilterElement.querySelector('#housing-rooms');
  var housingRooms;
  var housingGuestsFilterElement = mapFilterElement.querySelector('#housing-guests');
  var housingGuests;
  var numberSelectedFilters;
  var housingFeatureElements = mapFilterElement.querySelectorAll('input[name="features"]');
  var checkedHousingFeatures = [];

  // выбранные значения фильтров
  var getFilterValue = function () {
    housingType = housingTypeFilterElement.options[housingTypeFilterElement.selectedIndex].value;
    housingPrice = housingPriceFilterElement.options[housingPriceFilterElement.selectedIndex].value;
    housingRooms = housingRoomsFilterElement.options[housingRoomsFilterElement.selectedIndex].value;
    housingGuests = housingGuestsFilterElement.options[housingGuestsFilterElement.selectedIndex].value;
    getCheckedFeatures();
  };

  // количество выбранных фильтров
  var getNumberSelectedFilters = function () {
    numberSelectedFilters = 0;
    var mapFilters = Array.from(mapFilterChildren);
    mapFilters.forEach(function (item) {
      if (item.value !== 'any' && item.value) {
        numberSelectedFilters++;
      }
    });
    checkedHousingFeatures.forEach(function () {
      numberSelectedFilters++;
    });
    return numberSelectedFilters;
  };

  // выбранные значения удобств
  var getCheckedFeatures = function () {
    if (checkedHousingFeatures.length > 0) {
      checkedHousingFeatures.length = 0;
    }
    for (var i = 0; i < housingFeatureElements.length; i++) {
      if (housingFeatureElements[i].checked) {
        checkedHousingFeatures.push(housingFeatureElements[i].value);
      }
    }
    return checkedHousingFeatures;
  };

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
    if (ad.offer.rooms === parseInt(housingRooms, 10)) {
      rank++;
    }
    if (ad.offer.guests === parseInt(housingGuests, 10)) {
      rank++;
    }
    // рейтинг по выборанным удобствам
    checkedHousingFeatures.forEach(function (item) {
      if (ad.offer.features && ad.offer.features.includes(item)) {
        rank++;
      }
    });
    return rank;
  };

  // сортировка объявлений по имени
  var namesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    }
    return 0;
  };

  var compareRank = function (item) {
    return getRank(item) === numberSelectedFilters;
  };

  // изменение фильтров
  var onFilterChange = window.debounce(function () {
    getFilterValue();
    window.map.updateAds();
  });

  mapFilterElement.addEventListener('change', function () {
    onFilterChange();
  });

  window.filter = {
    getRank: getRank,
    getNumberSelected: getNumberSelectedFilters,
    compareRank: compareRank,
    namesComparator: namesComparator
  };
})();
