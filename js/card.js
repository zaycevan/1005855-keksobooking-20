'use strict';

(function () {
  var TYPES_RUS = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'};
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var getPluralWord = function (number, one, two, five) {
    var n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    } else if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
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
    cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + getPluralWord(data.offer.rooms, ' комната', ' комнаты', ' комнат')
     + ' для ' + data.offer.guests + getPluralWord(data.offer.guests, ' гостя', ' гостей', ' гостей');
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
      window.pin.inactivePin();
    });

    cardClose.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        closeCard();
        window.pin.inactivePin();
      }
    });

    return cardElement;
  };

  // Закрытие карточки объявления
  var closeCard = function () {
    var card = window.map.map.querySelector('.map__card');
    if (card) {
      window.map.map.removeChild(card);
    }
    document.removeEventListener('keydown', onCardEscPress);
  };

  var onCardEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeCard();
      window.pin.inactivePin();
    }
  };

  window.card = {
    getCard: getCard,
    closeCard: closeCard,
    onCardEscPress: onCardEscPress
  };

})();
