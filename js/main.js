'use strict';

var AMOUNT_ELEMENTS = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y = 130 + 70;
var MAX_Y = 630;
var MIN_X = 0;

var array = [];
var map = document.querySelector('.map');
var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var maxX = map.offsetWidth;

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
  for (var i = 0; i < getRandom(arr.length); i++) {
    randomArray.push(arr[i]);
  }
  return randomArray;
};

var getArray = function () {
  for (var i = 0; i < AMOUNT_ELEMENTS; i++) {
    var element = {
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
    array.push(element);
  }
};

map .classList.remove('map--faded');
getArray();

for (var i = 0; i < array.length; i++) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.setAttribute('style', 'left: ' + (array[i].location.x - 25) + 'px; top: ' + (array[i].location.y - 70) + 'px;');

  pinElement.querySelector('img').setAttribute('src', array[i].author.avatar);

  pinElement.querySelector('img').setAttribute('alt', array[i].offer.title);

  fragment.appendChild(pinElement);
}

pinListElement.appendChild(fragment);
