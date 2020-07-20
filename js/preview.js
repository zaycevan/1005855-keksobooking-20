'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg', 'wmf'];
  var avatarChooserElement = document.querySelector('#avatar');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var imageChooserElement = document.querySelector('#images');
  var imagePreviewContainerElement = document.querySelector('.ad-form__photo');

  // показывается аватарка
  avatarChooserElement.addEventListener('change', function () {
    var avatar = avatarChooserElement.files[0];
    var avatarName = avatar.name.toLowerCase();
    var matches = FILE_TYPES.some(function (item) {
      return avatarName.endsWith(item);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreviewElement.src = reader.result;
      });
      reader.readAsDataURL(avatar);
    }
  });

  // показывает фотографию помещения
  imageChooserElement.addEventListener('change', function () {
    removeImage();
    var image = imageChooserElement.files[0];
    var imageName = image.name.toLowerCase();
    var imagePreview = document.createElement('img');
    imagePreview.style.width = '100%';
    imagePreview.style.height = '100%';
    imagePreviewContainerElement.appendChild(imagePreview);
    var matches = FILE_TYPES.some(function (item) {
      return imageName.endsWith(item);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        imagePreview.src = reader.result;
      });
      reader.readAsDataURL(image);
    }
  });

  // удаление картинок
  var removeImage = function () {
    var previousImageElement = imagePreviewContainerElement.querySelector('img');
    if (previousImageElement) {
      previousImageElement.remove();
    }
  };
  var removeAvatar = function () {
    if (avatarPreviewElement.src) {
      avatarPreviewElement.src = 'img/muffin-grey.svg';
    }
  };

  window.preview = {
    removeImage: removeImage,
    removeAvatar: removeAvatar
  };
})();
