'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_WIDTH = 62;
  var MIN_Y = 130 - MAIN_PIN_HEIGHT;
  var MAX_Y = 630 - MAIN_PIN_HEIGHT;
  var MIN_X = 0 - MAIN_PIN_WIDTH / 2;
  var MAX_X = document.querySelector('.map').offsetWidth - MAIN_PIN_WIDTH / 2;
  var pinMainElement = document.querySelector('.map__pin--main');

  // ограничиваем перемещение метки в пределах карты
  var limitPinMove = function (x, y) {
    if (x < MIN_X) {
      pinMainElement.style['left'] = MIN_X + 'px';
    } else if (x > MAX_X) {
      pinMainElement.style['left'] = MAX_X + 'px';
    } else if (y < MIN_Y) {
      pinMainElement.style['top'] = MIN_Y + 'px';
    } else if (y > MAX_Y) {
      pinMainElement.style['top'] = MAX_Y + 'px';
    }
  };

  // отслеживание перемещения метки
  pinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // расстояние сдвига метки
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // начальные координаты метки
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var pinCoords = {
        x: pinMainElement.offsetLeft - shift.x,
        y: pinMainElement.offsetTop - shift.y
      };
      pinMainElement.style['left'] = pinCoords.x + 'px';
      pinMainElement.style['top'] = pinCoords.y + 'px';
      limitPinMove(pinCoords.x, pinCoords.y);

      // заполняем поле формы "Адрес"
      window.form.fillAddressInput(pinMainElement, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
    };

    // убираем обработчки событий после отпускания пина
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
