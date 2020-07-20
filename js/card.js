'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var filterContainerElement = document.querySelector('.map__filters-container');
  var TYPES_RUS = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'};
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var getPluralWord = function (value, one, two, five) {
    var number = Math.abs(value);
    number %= 100;
    if (number >= 5 && number <= 20) {
      return five;
    }
    number %= 10;
    if (number === 1) {
      return one;
    } else if (number >= 2 && number <= 4) {
      return two;
    }
    return five;
  };

  // Получение карточки объявления
  var getCard = function (data) {
    var cardElement = cardTemplate.cloneNode(true);
    var featureListElement = cardElement.querySelector('.popup__features');
    var featureElements = cardElement.querySelectorAll('.popup__feature');
    var photoListElement = cardElement.querySelector('.popup__photos');
    var photoOriginalElement = photoListElement.querySelector('.popup__photo');
    var photoCloneElement = photoOriginalElement.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = data.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = data.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = TYPES_RUS[data.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = data.offer.rooms + getPluralWord(data.offer.rooms, ' комната', ' комнаты', ' комнат')
     + ' для ' + data.offer.guests + getPluralWord(data.offer.guests, ' гостя', ' гостей', ' гостей');
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' выезд до ' + data.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = data.offer.description;
    cardElement.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);

    // добавляет значки удобств
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < featureElements.length; i++) {
      featureListElement.removeChild(featureElements[i]);
    }
    data.offer.features.forEach(function (item) {
      var feature = item;
      var dataFeatureElement = document.createElement('li');
      dataFeatureElement.classList.add('popup__feature', 'popup__feature--' + feature);
      fragment.appendChild(dataFeatureElement);
    });
    featureListElement.appendChild(fragment);

    // добавляет фотографии жилья
    photoListElement.removeChild(photoOriginalElement);
    data.offer.photos.forEach(function (item) {
      var photoElement = photoCloneElement.cloneNode(true);
      photoElement.setAttribute('src', item);
      photoListElement.appendChild(photoElement);
    });

    // Обработка события закрытия карточки объявления
    var cardClose = cardElement.querySelector('.popup__close');
    cardClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeCard();
      window.pin.inactive();
    });
    cardClose.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        closeCard();
        window.pin.inactive();
      }
    });
    return cardElement;
  };

  // Отрисовка карточки объявления
  var renderCard = function (data) {
    closeCard();
    if (data) {
      mapElement.insertBefore(getCard(data), filterContainerElement);
    }
  };

  // Закрытие карточки объявления
  var closeCard = function () {
    var cardElement = mapElement.querySelector('.map__card');
    if (cardElement) {
      mapElement.removeChild(cardElement);
    }
    document.removeEventListener('keydown', onCardEscPress);
  };

  var onCardEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeCard();
      window.pin.inactive();
    }
  };

  window.card = {
    get: getCard,
    render: renderCard,
    close: closeCard,
    onEscPress: onCardEscPress
  };
})();
