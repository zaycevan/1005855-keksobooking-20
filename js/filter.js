'use strict';

(function () {
  var mapFilter = window.map.map.querySelector('.map__filters');
  var housingTypeFilter = mapFilter.querySelector('#housing-type');
  var housingType;
  var housingPriceFilter = mapFilter.querySelector('#housing-price');
  var housingPrice;
  var housingRoomsFilter = mapFilter.querySelector('#housing-rooms');
  var housingRooms;
  var housingGuestsFilter = mapFilter.querySelector('#housing-guests');
  var housingGuests;


  var getFilterValue = function () {
    housingType = housingTypeFilter.options[housingTypeFilter.selectedIndex].value;

    housingPrice = housingPriceFilter.options[housingPriceFilter.selectedIndex].value;

    housingRooms = housingRoomsFilter.options[housingRoomsFilter.selectedIndex].value;

    housingGuests = housingGuestsFilter.options[housingGuestsFilter.selectedIndex].value;

    console.log(housingGuests + housingPrice + housingRooms);
  };

  // изменение фильтров
  var onFilterChange = window.debounce(function () {
    getFilterValue();
    window.map.updateAds();
  });

  mapFilter.addEventListener('change', function () {
    onFilterChange();
  });

  // сортировка объявлений по рейтингу
  var getRank = function (ad) {
    var rank = 0;
    if (ad.offer.type === housingType) {
      rank += 2;
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

  window.filter = {
    getRank: getRank,
    namesComparator: namesComparator
  };

})();
