'use strict';

var AMOUNT = 8;
var MIN_PRICE = 100;
var MAX_PRICE = 1000000;
var MIN_GUESTS = 1;
var MAX_GUESTS = 16;
var MIN_ROOMS = 1;
var MAX_ROOMS = 16;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;


var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_TITLE = ['Удобная квартира', 'Неудобная квартира', 'Классный дом', 'Неклассный дом', 'Супер бунгало', 'Не супер бунгало', 'Дворец для инстраграма', 'Дворец не для инстраграма'];
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
  var avatarsList = [];
  for (var i = 1; i < AMOUNT + 1; i++) {
    var avatars = 'img/avatars/user' + '0' + i + '.png';
    avatarsList.push(avatars);
  }
  return avatarsList;
}

// Создаем массив из 8 сгенерированных JS объектов
function generateAdvert() {
  var advert = [];
  var avatarForUser = generateAvatar();

  for (var i = 0; i < AMOUNT; i++) {
    var locationX = getRandomNumber(100, 1100);
    var locationY = getRandomNumber(130, 630);

    advert.push({
      'author': {
        'avatar': avatarForUser[i]
      },
      'offer': {
        'title': getRandomElement(OFFER_TITLE),
        'address': (locationX + ', ' + locationY),
        'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
        'type': getRandomElement(OFFER_TYPE),
        'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        'checkin': getRandomElement(HOURS),
        'checkout': getRandomElement(HOURS),
        'features': getRandomElement(OFFER_FEATURES),
        'description': 'Описание' + i,
        'photos': PHOTOS[i]
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    }
    );
  }
  return advert;
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

function insertPins(template) {
  var listAds = generateAdvert();
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

