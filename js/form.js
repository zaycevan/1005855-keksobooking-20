'use strict';

(function () {
  var ROOMS_VS_GUESTS = {
    1: '1',
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: '0',
    any: ['any', '0', '1', '2', '3']
  };
  var TYPES_VS_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var IMAGE_EXTENSIONS = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/wmf'];
  var MAIN_PIN_CIRCLE_HEIGHT = 62 / 2;
  var MAIN_PIN_CIRCLE_WIDTH = 62;
  var pinMainElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');
  var addressElement = adFormElement.querySelector('#address');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var titleElement = adFormElement.querySelector('#title');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var timeinElement = adFormElement.querySelector('#timein');
  var timeoutElement = adFormElement.querySelector('#timeout');
  var imagesElement = adFormElement.querySelector('#images');
  var avatarElement = adFormElement.querySelector('#avatar');
  var formResetButton = adFormElement.querySelector('.ad-form__reset');

  // Валидация Заголовка объявления
  titleElement.addEventListener('input', function () {
    var valueLength = titleElement.value.length;
    var minLength = titleElement.getAttribute('minlength');
    var maxLength = titleElement.getAttribute('maxlength');
    if (valueLength < minLength) {
      titleElement.setCustomValidity('Ещё ' + (minLength - valueLength) + ' символов');
    } else if (valueLength > maxLength) {
      titleElement.setCustomValidity('Удалите лишние ' + (valueLength - maxLength) + ' символов');
    } else {
      titleElement.setCustomValidity('');
    }
  });

  // Заполнение поля Адреса
  var fillAddressInput = function (pinShape, pinWidth, pinHeight) {
    var addressX = Math.round(pinShape.offsetLeft + pinWidth / 2);
    var addressY = Math.round(pinShape.offsetTop + pinHeight);
    addressElement.value = addressX + ', ' + addressY;
  };

  // Валидация минимального значения поля «Цена за ночь»
  var getMinPrice = function () {
    for (var i = 0; i < typeElement.options.length; i++) {
      var minPrice = TYPES_VS_PRICE[typeElement.options[typeElement.selectedIndex].value];
      priceElement.setAttribute('min', minPrice);
      priceElement.setAttribute('placeholder', minPrice);
    }
  };
  typeElement.addEventListener('change', function () {
    getMinPrice();
  });

  // Поля «Время заезда» и «Время выезда» синхронизированы
  timeinElement.addEventListener('change', function () {
    timeoutElement.value = timeinElement.options[timeinElement.selectedIndex].value;
  });
  timeoutElement.addEventListener('change', function () {
    timeinElement.value = timeoutElement.options[timeoutElement.selectedIndex].value;
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
  var checkRoomNumberCapacity = function () {
    if (roomNumberElement.value < capacityElement.value) {
      roomNumberElement.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
    } else {
      roomNumberElement.setCustomValidity('');
    }
  };
  roomNumberElement.addEventListener('change', function () {
    getNumberGuests(roomNumberElement, capacityElement);
    checkRoomNumberCapacity();
  });
  capacityElement.addEventListener('change', function () {
    checkRoomNumberCapacity();
  });

  // Валидация полей «Ваша фотография» и «Фотография жилья» - только изображение
  imagesElement.addEventListener('change', function () {
    for (var i = 0; i < imagesElement.files.length; i++) {
      var count = 0;
      if (IMAGE_EXTENSIONS.indexOf(imagesElement.files[i].type) === -1) {
        if (count === i) {
          imagesElement.setCustomValidity('Загрузите изображение');
        }
        count += 1;
      } else {
        imagesElement.setCustomValidity('');
      }
    }
  });
  avatarElement.addEventListener('change', function () {
    if (IMAGE_EXTENSIONS.indexOf(avatarElement.files[0].type) === -1) {
      avatarElement.setCustomValidity('Загрузите изображение');
    } else {
      avatarElement.setCustomValidity('');
    }
  });

  // Нажатие на кнопку Reset и сбрасывание страницы
  formResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.main.disablePage();
  });

  // отправка формы
  adFormElement.addEventListener('submit', function (evt) {
    window.upload(new FormData(adFormElement));
    evt.preventDefault();
  });

  // Вызов функции
  fillAddressInput(pinMainElement, MAIN_PIN_CIRCLE_WIDTH, MAIN_PIN_CIRCLE_HEIGHT);
  getMinPrice();

  window.form = {
    fillAddressInput: fillAddressInput,
    getMinPrice: getMinPrice
  };
})();
