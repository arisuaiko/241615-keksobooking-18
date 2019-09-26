<<<<<<< Updated upstream
=======
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

// Функция, генерирующая новый случайный массив из массива
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
function createPin(template, marker) {
  var element = template.cloneNode(true);

  var userAvatar = element.querySelector('img');
  userAvatar.src = marker.author.avatar;
  userAvatar.alt = marker.offer.title;
  element.style.left = (marker.location.x + PIN_WIDTH / 2) + 'px';
  element.style.top = (marker.location.y + PIN_HEIGHT) + 'px';

  return element;
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
  popupPrice.innerHTML = card.offer.price + '&#x20bd/ночь';
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


var listAds = generateAdvert();

function insertPins(template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < listAds.length; i++) {
    fragment.appendChild(createPin(template, listAds[i]));
  }
  return fragment;
}
var mapDialog = document.querySelector('.map');
mapDialog.classList.remove('map--faded');

var mapPinTemplate = document.querySelector('#pin').content.querySelector('button');
var pinsFragment = insertPins(mapPinTemplate);
var pinMap = document.querySelector('.map__pins');
pinMap.append(pinsFragment);

var mapCardTemplate = document.querySelector('#card').content.querySelector('article');
var cardFragment = createCard(listAds[0]);
var mapFiltersContainer = document.querySelector('.map__filters-container');
mapDialog.insertBefore(cardFragment, mapFiltersContainer);
>>>>>>> Stashed changes
