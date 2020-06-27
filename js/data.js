'use strict';

(function () {
  var AMOUNT_ELEMENTS = 8;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_Y = 130 + 70;
  var MAX_Y = 630;
  var MIN_X = 0;
  var map = document.querySelector('.map');
  var maxX = map.offsetWidth;

  // Получение рандомных значений
  var getRandom = function (number) {
    return Math.floor(Math.random() * number);
  };

  var getRandomArbitrary = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomArray = function (arr) {
    var randomArray = [];
    for (var i = 0; i < getRandom(arr.length) + 1; i++) {
      randomArray.push(arr[i]);
    }
    return randomArray;
  };

  // Получение массива похожих объявлений
  var getAds = function () {
    var ads = [];
    for (var i = 0; i < AMOUNT_ELEMENTS; i++) {
      var ad = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'title': 'заголовок предложения',
          'address': '600, 350',
          'price': 1500,
          'type': TYPES[getRandom(TYPES.length)],
          'rooms': 1,
          'guests': 2,
          'checkin': TIMES[getRandom(TIMES.length)],
          'checkout': TIMES[getRandom(TIMES.length)],
          'features': getRandomArray(FEATURES),
          'description': 'строка с описанием',
          'photos': getRandomArray(PHOTOS)
        },
        'location': {
          'x': getRandomArbitrary(MIN_X, maxX),
          'y': getRandomArbitrary(MIN_Y, MAX_Y)
        }
      };
      ads.push(ad);
    }
    return ads;
  };

  window.data = {
    getAds: getAds
  };
})();
