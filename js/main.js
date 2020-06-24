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
var PIN_SHAPE_COEFFICIENT = 1;
var CIRCLE_SHAPE_COEFFICIENT = 2;
var PIN_HEIGHT = 0;
var MAIN_PIN_HEIGHT = 22;
var ROOMS_VS_GUESTS = {
  1: '1',
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: '0',
  any: ['any', '0', '1', '2', '3']
};

var map = document.querySelector('.map');
var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinMain = pinListElement.querySelector('.map__pin--main');
var fragment = document.createDocumentFragment();
var maxX = map.offsetWidth;
var filterContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapFilter = map.querySelector('.map__filters');
var mapFilterChildren = mapFilter.children;
var address = adForm.querySelector('#address');
var housingRooms = mapFilter.querySelector('#housing-rooms');
var housingGuests = mapFilter.querySelector('#housing-guests');
var roomNumber = adForm.querySelector('#room_number');
var capacity = adForm.querySelector('#capacity');

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

// Добавление информации для меток из объявлений
var pin = function (data) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.setAttribute('style', 'left: ' + (data.location.x - 25) + 'px; top: ' + (data.location.y - 70) + 'px;');
  pinElement.querySelector('img').setAttribute('src', data.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', data.offer.title);

  // Обработка событий нажатия на метку
  pinElement.addEventListener('click', function () {
    inactivePin();
    activatePin(pinElement);
    renderCard(data);

    document.addEventListener('keydown', onCardEscPress);
  });

  pinElement.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      inactivePin();
      activatePin(pinElement);
      renderCard(data);

      document.addEventListener('keydown', onCardEscPress);
    }
  });

  return pinElement;
};

// Снятие класса .active с метки
var inactivePin = function () {
  var activePin = map.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// Добавление класса .active на метку
var activatePin = function (pinElement) {
  pinElement.classList.add('map__pin--active');
};

// Отрисовка меток на карте
var renderPins = function (data) {
  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(pin(data[i]));
  }
  pinListElement.appendChild(fragment);
};

// Получение карточки объявления
var getCard = function (data) {
  var cardElement = cardTemplate.cloneNode(true);
  var featureList = cardElement.querySelector('.popup__features');
  var featureElement = cardElement.querySelectorAll('.popup__feature');
  var photoList = cardElement.querySelector('.popup__photos');
  var photoElementOriginal = photoList.querySelector('.popup__photo');
  var photoElementClone = photoElementOriginal.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = data.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPES_RUS[data.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = data.offer.description;
  cardElement.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);

  for (var i = data.offer.features.length; i < featureElement.length; i++) {
    featureList.removeChild(featureElement[i]);
  }

  photoList.removeChild(photoElementOriginal);
  for (var j = 0; j < data.offer.photos.length; j++) {
    var photoElement = photoElementClone.cloneNode(true);
    photoElement.setAttribute('src', data.offer.photos[j]);
    photoList.appendChild(photoElement);
  }

  // Обработка события закрытия карточки объявления
  var cardClose = cardElement.querySelector('.popup__close');

  cardClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeCard();
    inactivePin();
  });

  cardClose.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      closeCard();
      inactivePin();
    }
  });

  return cardElement;
};

// Отрисовка картояки объявления
var renderCard = function (data) {
  closeCard();
  if (data) {
    map.insertBefore(getCard(data), filterContainer);
  }
};

// Закрытие карточки объявления
var closeCard = function () {
  var card = map.querySelector('.map__card');
  if (card) {
    map.removeChild(card);
  }
  document.removeEventListener('keydown', onCardEscPress);
};

var onCardEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeCard();
    inactivePin();
  }
};

// Блокировка полей ввода
var disableInput = function (input) {
  for (var i = 0; i < input.length; i++) {
    input[i].setAttribute('disabled', 'disabled');
  }
};

// Активация полей ввода
var enableInput = function (input) {
  for (var i = 0; i < input.length; i++) {
    input[i].removeAttribute('disabled');
  }
};

// Активация страницы
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableInput(adFormFieldsets);
  enableInput(mapFilterChildren);
};

// Заполнение поля Адреса
var fillAddressInput = function (pinShape, shapeCoefficient, pinHeight) {
  var addressX = Math.round(parseInt(pinShape.style.left, 10) + pinShape.offsetWidth / 2);
  var addressY = Math.round(parseInt(pinShape.style.top, 10) + pinShape.offsetHeight / shapeCoefficient + pinHeight);
  address.value = addressX + ', ' + addressY;
};

// Обработка события нажатия на Главный пин
pinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    evt.preventDefault();
    if (map.classList.contains('map--faded')) {
      activatePage();
      fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
      renderPins(getAds());
    }
  }
});

pinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    if (map.classList.contains('map--faded')) {
      activatePage();
      fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
      renderPins(getAds());
    }
  }
});

// Поле «Количество комнат» синхронизировано с полем «Количество мест»
var getNumberGuests = function (rooms, guests) {
  guests.value = rooms.options[rooms.selectedIndex].value;
  if (rooms.options[rooms.selectedIndex].value === '100') {
    guests.value = '0';
  }
  for (var i = 0; i < guests.options.length; i++) {
    if (ROOMS_VS_GUESTS[rooms.options[rooms.selectedIndex].value].indexOf(guests.options[i].value) === -1) {
      guests.options[i].style.display = 'none';
    } else {
      guests.options[i].style.display = 'block';
    }
  }
};

housingRooms.addEventListener('change', function () {
  getNumberGuests(housingRooms, housingGuests);
});

roomNumber.addEventListener('change', function () {
  getNumberGuests(roomNumber, capacity);
});

// Валидация Заголовка объявления
var title = adForm.querySelector('#title');

title.addEventListener('input', function () {
  var valueLength = title.value.length;
  var MIN_LENGTH = title.getAttribute('minlength');
  var MAX_LENGTH = title.getAttribute('maxlength');
  if (valueLength < MIN_LENGTH) {
    title.setCustomValidity('Ещё ' + (MIN_LENGTH - valueLength) + ' символов');
  } else if (valueLength > MAX_LENGTH) {
    title.setCustomValidity('Удалите лишние ' + (valueLength - MAX_LENGTH) + ' символов');
  } else {
    title.setCustomValidity('');
  }
});

// Валидация минимального значения поля «Цена за ночь»
var type = adForm.querySelector('#type');
var price = adForm.querySelector('#price');

var getMinPrice = function () {
  var TYPES_VS_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  for (var i = 0; i < type.options.length; i++) {
    price.setAttribute('min', TYPES_VS_PRICE[type.options[type.selectedIndex].value]);
    price.setAttribute('placeholder', TYPES_VS_PRICE[type.options[type.selectedIndex].value]);
  }
};

type.addEventListener('change', function () {
  getMinPrice();
});

// Поля «Время заезда» и «Время выезда» синхронизированы
var timein = adForm.querySelector('#timein');
var timeout = adForm.querySelector('#timeout');

timein.addEventListener('change', function () {
  timeout.value = timein.options[timein.selectedIndex].value;
});

timeout.addEventListener('change', function () {
  timein.value = timeout.options[timeout.selectedIndex].value;
});

// Валидация полей «Ваша фотография» и «Фотография жилья» - только изображение
var images = adForm.querySelector('#images');
var avatar = adForm.querySelector('#avatar');
var imageExts = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/wmf'];

images.addEventListener('change', function () {
  for (var i = 0; i < images.files.length; i++) {
    var count = 0;
    if (imageExts.indexOf(images.files[i].type) === -1) {
      if (count === i) {
        images.setCustomValidity('Загрузите изображение');
      }
      count += 1;
    } else {
      images.setCustomValidity('');
    }
  }
});

avatar.addEventListener('change', function () {
  if (imageExts.indexOf(avatar.files[0].type) === -1) {
    avatar.setCustomValidity('Загрузите изображение');
  } else {
    avatar.setCustomValidity('');
  }
});

// Вызовы функций
disableInput(adFormFieldsets);

disableInput(mapFilterChildren);

fillAddressInput(pinMain, CIRCLE_SHAPE_COEFFICIENT, PIN_HEIGHT);

getMinPrice();
