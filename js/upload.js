'use strict';

(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  // удачная отправка данных на сервер
  var onSuccess = function () {
    var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
    var successMessage = successMessageTemplate.cloneNode(true);
    var successMessageText = successMessage.querySelector('.success__message');

    // добавление сообщение об отправке данных
    document.querySelector('main').appendChild(successMessage);

    // удаление сообщения об отправке данных
    var removeOnSuccess = function (evt) {
      if (evt.target !== successMessageText) {
        evt.preventDefault();
        successMessage.remove();

        document.removeEventListener('click', removeOnSuccess);
        document.removeEventListener('keydown', successEscPress);
      }
    };

    var successEscPress = function (evt) {
      if (evt.key === 'Escape') {
        removeOnSuccess(evt);
      }
    };

    // закрытие сообщения об отправке данных по клику и ESC
    if (successMessage) {
      document.addEventListener('click', removeOnSuccess);
      document.addEventListener('keydown', successEscPress);
    }
  };

  // ошибка отправки данных на сервер
  var onError = function () {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessage = errorMessageTemplate.cloneNode(true);
    var errorMessageText = errorMessage.querySelector('.error__message');
    var errorButton = errorMessage.querySelector('.error__button');

    // добавление сообщение об ошибке отправки данных
    document.querySelector('main').appendChild(errorMessage);

    // удаление сообщения об ошибке отправки данных
    var removeOnError = function (evt) {
      if (evt.target !== errorMessageText) {
        evt.preventDefault();
        errorMessage.remove();

        document.removeEventListener('click', removeOnError);
        document.removeEventListener('keydown', errorEscPress);
      }
    };

    var errorEscPress = function (evt) {
      if (evt.key === 'Escape') {
        removeOnError(evt);
      }
    };

    // закрытие сообщения об ошибке отправки данных по клику на кнопку, на область и ESC
    if (errorMessage) {
      errorButton.addEventListener('click', removeOnError);
      document.addEventListener('click', removeOnError);
      document.addEventListener('keydown', errorEscPress);
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
