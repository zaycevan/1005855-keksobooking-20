'use strict';

(function () {
  var ROOMS_VS_GUESTS = {
    1: '1',
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: '0',
    any: ['any', '0', '1', '2', '3']
  };
  var CIRCLE_SHAPE_COEFFICIENT = 2;
  var PIN_HEIGHT = 0;
  var pinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');

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

  // Заполнение поля Адреса
  var fillAddressInput = function (pinShape, shapeCoefficient, pinHeight) {
    var addressX = Math.round(parseInt(pinShape.style.left, 10) + pinShape.offsetWidth / 2);
    var addressY = Math.round(parseInt(pinShape.style.top, 10) + pinShape.offsetHeight / shapeCoefficient + pinHeight);
    address.value = addressX + ', ' + addressY;
  };

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

  roomNumber.addEventListener('change', function () {
    getNumberGuests(roomNumber, capacity);
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

  // Вызов функции
  fillAddressInput(pinMain, CIRCLE_SHAPE_COEFFICIENT, PIN_HEIGHT);
  getMinPrice();

  window.form = {
    fillAddressInput: fillAddressInput
  };

})();
