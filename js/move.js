'use strict';

(function () {
  window.map.pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var PIN_SHAPE_COEFFICIENT = 1;
    var MAIN_PIN_HEIGHT = 22;
    var MIN_Y = 130;
    var MAX_Y = 630;
    var MIN_X = 0;
    var maxX = window.map.map.offsetWidth;

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
        x: window.map.pinMain.offsetLeft + window.map.pinMain.offsetWidth / 2,
        y: window.map.pinMain.offsetTop + window.map.pinMain.offsetHeight / PIN_SHAPE_COEFFICIENT + MAIN_PIN_HEIGHT
      };

      // ограничиваем перемещение метки в пределах карты
      if (pinBottomCoords.x >= MIN_X && pinBottomCoords.x <= maxX && pinBottomCoords.y >= MIN_Y && pinBottomCoords.y <= MAX_Y) {
        window.map.pinMain.style.top = (window.map.pinMain.offsetTop - shift.y) + 'px';
        window.map.pinMain.style.left = (window.map.pinMain.offsetLeft - shift.x) + 'px';
      } else if (pinBottomCoords.x < MIN_X) {
        window.map.pinMain.style.left = (-window.map.pinMain.offsetWidth / 2) + 'px';
      } else if (pinBottomCoords.x > maxX) {
        window.map.pinMain.style.left = maxX - 1 - window.map.pinMain.offsetWidth / 2 + 'px';
      } else if (pinBottomCoords.y < MIN_Y) {
        window.map.pinMain.style.top = MIN_Y - window.map.pinMain.offsetHeight - MAIN_PIN_HEIGHT + 'px';
      } else if (pinBottomCoords.y > MAX_Y) {
        window.map.pinMain.style.top = MAX_Y - window.map.pinMain.offsetHeight - MAIN_PIN_HEIGHT + 'px';
      }

      // заполняем поле формы "Адрес"
      window.form.fillAddressInput(window.map.pinMain, PIN_SHAPE_COEFFICIENT, MAIN_PIN_HEIGHT);
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
