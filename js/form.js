'use strict';

(function () {
  var ROOMS_VS_GUESTS = {
    1: '1',
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: '0',
    any: ['any', '0', '1', '2', '3']
  };
  var IMAGE_EXTS = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/wmf'];
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
    var minLength = title.getAttribute('minlength');
    var maxLength = title.getAttribute('maxlength');
    if (valueLength < minLength) {
      title.setCustomValidity('Ещё ' + (minLength - valueLength) + ' символов');
    } else if (valueLength > maxLength) {
      title.setCustomValidity('Удалите лишние ' + (valueLength - maxLength) + ' символов');
    } else {
      title.setCustomValidity('');
    }
  });

  // Заполнение поля Адреса
  var fillAddressInput = function (pinShape, shapeCoefficient, pinHeight) {
    var addressX = Math.round(pinShape.offsetLeft + pinShape.offsetWidth / 2);
    var addressY = Math.round(pinShape.offsetTop + pinShape.offsetHeight / shapeCoefficient + pinHeight);
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

  var ifRoomNumberLessCapacity = function () {
    if (roomNumber.value < capacity.value) {
      roomNumber.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  roomNumber.addEventListener('change', function () {
    getNumberGuests(roomNumber, capacity);
    ifRoomNumberLessCapacity();
  });

  capacity.addEventListener('change', function () {
    ifRoomNumberLessCapacity();
  });

  // Валидация полей «Ваша фотография» и «Фотография жилья» - только изображение
  var images = adForm.querySelector('#images');
  var avatar = adForm.querySelector('#avatar');

  images.addEventListener('change', function () {
    for (var i = 0; i < images.files.length; i++) {
      var count = 0;
      if (IMAGE_EXTS.indexOf(images.files[i].type) === -1) {
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
    if (IMAGE_EXTS.indexOf(avatar.files[0].type) === -1) {
      avatar.setCustomValidity('Загрузите изображение');
    } else {
      avatar.setCustomValidity('');
    }
  });

  // Нажатие на кнопку Reset и сбрасывание страницы
  var formResetButton = adForm.querySelector('.ad-form__reset');

  formResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.main.disablePage();
  });

  // отправка формы
  adForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(adForm));
    evt.preventDefault();
  });

  // Вызов функции
  fillAddressInput(pinMain, CIRCLE_SHAPE_COEFFICIENT, PIN_HEIGHT);
  getMinPrice();

  window.form = {
    fillAddressInput: fillAddressInput,
    getMinPrice: getMinPrice
  };

})();
