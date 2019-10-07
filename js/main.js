'use strict';

var AMOUNT = 8;
var MIN_PRICE = 100;
var MAX_PRICE = 100000;
var MIN_GUESTS = 1;
var MAX_GUESTS = 16;
var MIN_ROOMS = 1;
var MAX_ROOMS = 16;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_TITLES = ['Удобная квартира', 'Неудобная квартира', 'Классный дом', 'Неклассный дом', 'Супер бунгало', 'Не супер бунгало', 'Дворец для инстраграма', 'Дворец не для инстраграма'];
var HOURS = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Функция, возвращающая случайный элемемент массива
function getRandomElement(array) {
  var randomIndex = getRandomNumber(0, array.length);
  var randomElement = array[randomIndex];
  return randomElement;
}

// Функция, возвращающая случайное число в диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция, генерирующая аватарки
function generateAvatar() {
  var avatarsLists = [];
  for (var i = 1; i < AMOUNT + 1; i++) {
    var avatars = 'img/avatars/user' + '0' + i + '.png';
    avatarsLists.push(avatars);
  }
  return avatarsLists;
}

// Функция, перемешивающая массив
function getRandomArrayElements(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var tempValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
}

// Создаем массив из 8 сгенерированных JS объектов
function generateAdvert() {
  var adverts = [];
  var avatarForUser = generateAvatar();

  for (var i = 0; i < AMOUNT; i++) {
    var locationX = getRandomNumber(100, 1100);
    var locationY = getRandomNumber(130, 630);

    adverts.push({
      'author': {
        'avatar': avatarForUser[i]
      },
      'offer': {
        'title': getRandomElement(OFFER_TITLES),
        'address': (locationX + ', ' + locationY),
        'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
        'type': getRandomElement(OFFER_TYPES),
        'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        'checkin': getRandomElement(HOURS),
        'checkout': getRandomElement(HOURS),
        'features': getRandomArrayElements(OFFER_FEATURES),
        'description': 'Здесь есть некоторое описание',
        'photos': PHOTOS
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    }
    );
  }
  return adverts;
}

// Вставляем данные в шаблон, по которому будут собираться все метки для карты
function createPin(template, markers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < markers.length; i++) {
    var element = template.cloneNode(true);
    var marker = markers[i];

    var userAvatar = element.querySelector('img');
    userAvatar.src = marker.author.avatar;
    userAvatar.alt = marker.offer.title;
    element.style.left = (marker.location.x + PIN_WIDTH / 2) + 'px';
    element.style.top = (marker.location.y + PIN_HEIGHT) + 'px';
    clickOnPin(element, marker);
    fragment.appendChild(element);
  }
  return fragment;
}

function clickOnPin(element, marker) {
  element.addEventListener('click', function () {
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    var cardPopUp = document.querySelector('.popup');
    if (cardPopUp) {
      cardPopUp.remove();
    }
    var cardFragment = createCard(marker);
    mapDialog.insertBefore(cardFragment, mapFiltersContainer);

    var cardPopUpClosing = document.querySelector('.popup__close');
    cardPopUpClosing.addEventListener('click', function () {
      document.querySelector('.popup').classList.add('hidden');
    });

    cardPopUpClosing.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 13) {
        document.querySelector('.popup').classList.add('hidden');
      }
    });
  });
}

// Cоздаём DOM-элемент объявления, заполняем его данными из объекта:
function createCard(card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var popupTitle = cardElement.querySelector('h3');
  var popupAddress = cardElement.querySelector('.popup__text--address');
  var popupPrice = cardElement.querySelector('.popup__text--price');
  var popupType = cardElement.querySelector('h4');
  var popupCapacity = cardElement.querySelector('.popup__text--capacity');
  var popupTime = cardElement.querySelector('.popup__text--time');
  var popupFeatures = cardElement.querySelector('.popup__features');
  var popupDescription = cardElement.querySelector('.popup__description');
  var popupPhotos = cardElement.querySelector('.popup__photos');
  var popupPhoto = cardElement.querySelector('.popup__photo');
  var popupAvatar = cardElement.querySelector('img');

  popupTitle.textContent = card.offer.title;
  popupAddress.textContent = card.address;
  popupPrice.textContent = card.offer.price + ' ₽/ночь';
  popupType.textContent = switchType();
  popupCapacity.textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  popupTime.textContent = 'Заезд после' + card.offer.checkin + ',' + ' выезд до ' + card.offer.checkout;

  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  popupFeatures.appendChild(createFeatureElement(card.offer.features));
  popupDescription.textContent = card.offer.description;

  while (popupPhotos.firstChild) {
    popupPhotos.removeChild(popupPhotos.firstChild);
  }
  popupPhotos.appendChild(addPhotoElement(card.offer.photos, popupPhoto));
  popupAvatar.src = card.author.avatar;
  return cardElement;
}

// Функция для createCard, которая выводит тип жилья
function switchType(type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец ';
    default:
      return type;
  }
}

// Функция для createCard, которая создает li-элемент для списка
function createFeatureElement(arrayFeatures) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayFeatures.length; i++) {
    var cardCreatedElementLi = document.createElement('li');
    cardCreatedElementLi.classList.add('popup__feature');
    cardCreatedElementLi.classList.add('popup__feature--' + arrayFeatures[i]);
    fragment.appendChild(cardCreatedElementLi);
  }
  return fragment;
}

// Функция для createCard, которая записывает строки, как src соответствующего изображения
function addPhotoElement(arrayPhotos, element) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayPhotos.length; i++) {
    var clonElement = element.cloneNode(true);
    clonElement.src = arrayPhotos[i];
    fragment.appendChild(clonElement);
  }
  return fragment;
}

function addCoordinateToInactiveAddress(coordinate) {
  var centerX = Math.floor(coordinate.offsetLeft + coordinate.offsetWidth / 2);
  var centerY = Math.floor(coordinate.offsetTop + coordinate.offsetHeight / 2);
  return centerX + ',' + centerY;
}

function addCoordinateToActiveAddress(coordinate) {
  var centerX = Math.floor(coordinate.offsetLeft + coordinate.offsetWidth / 2);
  var centerY = Math.floor(coordinate.offsetTop + (coordinate.offsetHeight + 22) / 2);
  return centerX + ',' + centerY;
}

function makePageIncactive(template, fieldsetheader, fieldsettitle, fieldsetselector) {
  template.classList.add('map--faded');
  fieldsetheader.disabled = true;
  for (var i = 0; i < fieldsettitle.length; i++) {
    fieldsettitle[i].disabled = true;
  }

  for (var j = 0; j < fieldsetselector.length; j++) {
    fieldsetselector[j].disabled = true;
  }
  addressInput.value = addCoordinateToInactiveAddress(pinMapMain);
}

function makePageActive(template, fieldsetheader, fieldsettitle, fieldsetselector) {
  template.classList.remove('map--faded');
  var adForm = document.querySelector('.ad-form');
  adForm.classList.remove('ad-form--disabled');
  fieldsetheader.disabled = false;
  for (var i = 0; i < fieldsettitle.length; i++) {
    fieldsettitle[i].disabled = false;
  }

  for (var j = 0; j < fieldsetselector.length; j++) {
    fieldsetselector[j].disabled = false;
  }
  addressInput.value = addCoordinateToActiveAddress(pinMapMain);
}

function validateHousing() {
  var housingRoomsSelect = document.querySelector('#room_number');
  var housingGuestsSelect = document.querySelector('#capacity');

  function checkValidationRoomsAndGuests() {

    var roomNumber = housingRoomsSelect.value;
    var guestNumber = housingGuestsSelect.value;
    if (roomNumber === '100') {
      housingGuestsSelect.setCustomValidity('Не предназначено для гостей');
    } else if (guestNumber > roomNumber) {
      housingGuestsSelect.setCustomValidity('Количество комнат должно быть больше');
    } else {
      housingGuestsSelect.setCustomValidity('');
    }
  }

  housingGuestsSelect.addEventListener('change', checkValidationRoomsAndGuests);
  housingRoomsSelect.addEventListener('change', checkValidationRoomsAndGuests);
}

validateHousing();

var listAds = generateAdvert();

var mapDialog = document.querySelector('.map');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('button');
var mapCardTemplate = document.querySelector('#card').content.querySelector('article');
var pinMapMain = document.querySelector('.map__pin--main');

pinMapMain.addEventListener('mousedown', function () {
  makePageActive(mapDialog, fieldsetAdFormHeader, fieldsetAdFormElementTitle, filtersContainerSelectors);

  var pinsFragment = createPin(mapPinTemplate, listAds);
  var pinMap = document.querySelector('.map__pins');
  pinMap.append(pinsFragment);
});

pinMapMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    makePageActive(mapDialog, fieldsetAdFormHeader, fieldsetAdFormElementTitle, filtersContainerSelectors);
  }
});

var addressInput = document.querySelector('#address');
var fieldsetAdFormHeader = document.querySelector('.ad-form-header');
var fieldsetAdFormElementTitle = document.querySelectorAll('.ad-form__element');
var filtersContainerSelectors = document.querySelectorAll('select');
makePageIncactive(mapDialog, fieldsetAdFormHeader, fieldsetAdFormElementTitle, filtersContainerSelectors);

var adFormResetButton = document.querySelector('.ad-form__reset');

adFormResetButton.addEventListener('click', function () {
  makePageIncactive(mapDialog, fieldsetAdFormHeader, fieldsetAdFormElementTitle, filtersContainerSelectors);
});
