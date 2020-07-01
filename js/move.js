'use strict';

(function () {
  var PIN_SHAPE_COEFFICIENT = 1;
  var MAIN_PIN_HEIGHT = 22;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MIN_X = 0;
  var maxX = window.map.map.offsetWidth;
  var pinMain = document.querySelector('.map__pin--main');

  // проверка, что координаты метки внутри карты
  var isInsideMap = function (x, y) {
    return x >= MIN_X && x <= maxX && y >= MIN_Y && y <= MAX_Y;
  };

  pinMain.addEventListener('mousedown', function (evt) {
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

      // координаты острого конца метки
      var pinBottomCoords = {
        x: pinMain.offsetLeft + pinMain.offsetWidth / 2,
        y: pinMain.offsetTop + pinMain.offsetHeight / PIN_SHAPE_COEFFICIENT + MAIN_PIN_HEIGHT
      };

      // ограничиваем перемещение метки в пределах карты
      if (isInsideMap(pinBottomCoords.x, pinBottomCoords.y)) {
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      } else if (pinBottomCoords.x < MIN_X) {
        pinMain.style.left = (-pinMain.offsetWidth / 2) + 'px';
      } else if (pinBottomCoords.x > maxX) {
        pinMain.style.left = maxX - 1 - pinMain.offsetWidth / 2 + 'px';
      } else if (pinBottomCoords.y < MIN_Y) {
        pinMain.style.top = MIN_Y - pinMain.offsetHeight - MAIN_PIN_HEIGHT + 'px';
      } else if (pinBottomCoords.y > MAX_Y) {
        pinMain.style.top = MAX_Y - pinMain.offsetHeight - MAIN_PIN_HEIGHT + 'px';
      }

      // заполняем поле формы "Адрес"
      window.form.fillAddressInput(pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
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
