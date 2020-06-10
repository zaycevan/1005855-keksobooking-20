'use strict';

var AMOUNT_ELEMENTS = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_RUS = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'};
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y = 130 + 70;
var MAX_Y = 630;
var MIN_X = 0;

var map = document.querySelector('.map');
var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var maxX = map.offsetWidth;
var filterContainer = document.querySelector('.map__filters-container');

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

var renderView = function (data) {
  for (var i = 0; i < data.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute('style', 'left: ' + (data[i].location.x - 25) + 'px; top: ' + (data[i].location.y - 70) + 'px;');
    pinElement.querySelector('img').setAttribute('src', data[i].author.avatar);
    pinElement.querySelector('img').setAttribute('alt', data[i].offer.title);
    fragment.appendChild(pinElement);
  }
  pinListElement.appendChild(fragment);
};

map.classList.remove('map--faded');

var viewData = getAds();

renderView(viewData);

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getCard = function (data) {

  var cardElement = cardTemplate.cloneNode(true);
  var photoList = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = data.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPES_RUS[data.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;

  var featureElement = cardElement.querySelectorAll('.popup__feature');

  for (var i = 0; i < data.offer.features.length; i++) {
    featureElement[i].textContent = data.offer.features[i];
  }

  cardElement.querySelector('.popup__description').textContent = data.offer.description;

  for (var j = 0; j < data.offer.photos.length; j++) {
    var photoElement = photoList.querySelector('.popup__photo').cloneNode(true);

    if (j === 0) {
      photoList.querySelector('.popup__photo').setAttribute('src', data.offer.photos[0]);
    } else {
      photoElement.setAttribute('src', data.offer.photos[j]);
      photoList.appendChild(photoElement);
    }
  }

  cardElement.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);

  return cardElement;
};

map.insertBefore(getCard(viewData[0]), filterContainer);
