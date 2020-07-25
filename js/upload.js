'use strict';

(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200
  };
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  // удачная отправка данных на сервер
  var onSuccess = function () {
    var successMessageElement = successMessageTemplate.cloneNode(true);
    var successMessageText = successMessageElement.querySelector('.success__message');

    // добавление сообщение об отправке данных
    document.querySelector('main').appendChild(successMessageElement);

    // удаление сообщения об отправке данных
    var onSuccessClick = function (evt) {
      if (evt.target !== successMessageText) {
        evt.preventDefault();
        successMessageElement.remove();
        document.removeEventListener('click', onSuccessClick);
        document.removeEventListener('keydown', onSuccessEscPress);
      }
    };
    var onSuccessEscPress = function (evt) {
      if (evt.key === 'Escape') {
        onSuccessClick(evt);
      }
    };

    // закрытие сообщения об отправке данных по клику и ESC
    if (successMessageElement) {
      document.addEventListener('click', onSuccessClick);
      document.addEventListener('keydown', onSuccessEscPress);
    }
  };

  // ошибка отправки данных на сервер
  var onError = function () {
    var errorMessageElement = errorMessageTemplate.cloneNode(true);
    var errorMessageText = errorMessageElement.querySelector('.error__message');
    var errorButton = errorMessageElement.querySelector('.error__button');

    // добавление сообщение об ошибке отправки данных
    document.querySelector('main').appendChild(errorMessageElement);

    // удаление сообщения об ошибке отправки данных
    var onErrorClick = function (evt) {
      if (evt.target !== errorMessageText) {
        evt.preventDefault();
        errorMessageElement.remove();
        document.removeEventListener('click', onErrorClick);
        document.removeEventListener('keydown', onErrorEscPress);
      }
    };
    var onErrorEscPress = function (evt) {
      if (evt.key === 'Escape') {
        onErrorClick(evt);
      }
    };

    // закрытие сообщения об ошибке отправки данных по клику на кнопку, на область и ESC
    if (errorMessageElement) {
      errorButton.addEventListener('click', onErrorClick);
      document.addEventListener('click', onErrorClick);
      document.addEventListener('keydown', onErrorEscPress);
    }
  };

  // отправка данных на сервер
  window.upload = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess();
        window.main.disablePage();
      } else {
        onError();
      }
    });

    // ошибка соединения с сервером
    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.addEventListener('timeout', function () {
      onError();
    });
    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
