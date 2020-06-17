'use strict';

var AMOUNT_ELEMENTS = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
// var TYPES_RUS = {
//   'palace': 'Дворец',
//   'flat': 'Квартира',
//   'house': 'Дом',
//   'bungalo': 'Бунгало'};
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y = 130 + 70;
var MAX_Y = 630;
var MIN_X = 0;
var PIN_SHAPE_COEFFICIENT = 1;
var CIRCLE_SHAPE_COEFFICIENT = 2;
var PIN_HEIGHT = 0;
var MAIN_PIN_HEIGHT = 22;

var map = document.querySelector('.map');
var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinMain = pinListElement.querySelector('.map__pin--main');
var fragment = document.createDocumentFragment();
var maxX = map.offsetWidth;
// var filterContainer = document.querySelector('.map__filters-container');
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapFilter = map.querySelector('.map__filters');
var mapFilterChildren = mapFilter.children;
var address = adForm.querySelector('#address');
var housingRooms = mapFilter.querySelector('#housing-rooms');
var housingGuests = mapFilter.querySelector('#housing-guests');

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

var renderPins = function (data) {
  for (var i = 0; i < data.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute('style', 'left: ' + (data[i].location.x - 25) + 'px; top: ' + (data[i].location.y - 70) + 'px;');
    pinElement.querySelector('img').setAttribute('src', data[i].author.avatar);
    pinElement.querySelector('img').setAttribute('alt', data[i].offer.title);
    fragment.appendChild(pinElement);
  }
  pinListElement.appendChild(fragment);
};

// var getCard = function (data) {

//   var cardElement = cardTemplate.cloneNode(true);
//   var featureList = cardElement.querySelector('.popup__features');
//   var featureElement = cardElement.querySelectorAll('.popup__feature');
//   var photoList = cardElement.querySelector('.popup__photos');
//   var photoElementOriginal = photoList.querySelector('.popup__photo');
//   var photoElementClone = photoElementOriginal.cloneNode(true);

//   cardElement.querySelector('.popup__title').textContent = data.offer.title;
//   cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
//   cardElement.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
//   cardElement.querySelector('.popup__type').textContent = TYPES_RUS[data.offer.type];
//   cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
//   cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;
//   cardElement.querySelector('.popup__description').textContent = data.offer.description;
//   cardElement.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);

//   for (var i = data.offer.features.length; i < featureElement.length; i++) {
//     featureList.removeChild(featureElement[i]);
//   }

//   photoList.removeChild(photoElementOriginal);
//   for (var j = 0; j < data.offer.photos.length; j++) {
//     var photoElement = photoElementClone.cloneNode(true);
//     photoElement.setAttribute('src', data.offer.photos[j]);
//     photoList.appendChild(photoElement);
//   }
//   return cardElement;
// };

// var renderCard = function (data) {
//   if (data) {
//     map.insertBefore(getCard(data), filterContainer);
//   }
// };

// renderCard(viewData[0]);

var renderSimilarAds = function () {
  var similarAds = getAds();
  renderPins(similarAds);
};

var disableInput = function (input) {
  for (var i = 0; i < input.length; i++) {
    input[i].setAttribute('disabled', 'disabled');
  }
};

var enableInput = function (input) {
  for (var i = 0; i < input.length; i++) {
    input[i].removeAttribute('disabled');
  }
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableInput(adFormFieldsets);
  enableInput(mapFilterChildren);
};

pinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    evt.preventDefault();
    activatePage();
    fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
    renderSimilarAds();
  }
});

pinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    activatePage();
    fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
    renderSimilarAds();
  }
});

var fillAddressInput = function (pin, ShapeCoefficient, pinHeight) {
  var addressX = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
  var addressY = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight / ShapeCoefficient + pinHeight);
  address.value = addressX + ', ' + addressY;
};

disableInput(adFormFieldsets);

disableInput(mapFilterChildren);

fillAddressInput(pinMain, CIRCLE_SHAPE_COEFFICIENT, PIN_HEIGHT);

housingRooms.addEventListener('change', function () {
  var RvsG = {
    1: '1',
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: '0',
    any: ['any', '0', '1', '2', '3']
  };

  for (var i = housingGuests.options.length - 1; i >= 0; i--) {
    if (RvsG[housingRooms.options[housingRooms.selectedIndex].value].indexOf(housingGuests.options[i].value) === -1) {
      housingGuests.options[i].setAttribute('disabled', 'disabled');
    } else {
      housingGuests.options[i].removeAttribute('disabled');
    }
  }
});
