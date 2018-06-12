'use strict';
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var OFFERS_NUMBER = 8;
var OFFER_DESCRIPTION = '';
var OFFER_TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var OFFER_CHECKIN = [
  '12:00',
  '13:00',
  '14:00'
];

var OFFER_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];

var OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var author = {
  image: [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'
  ],
  avatar: function () {
    this.image.forEach(function (element) {
      return element;
    });
  }
};

console.log(author.avatar());

var makeOfferAddress = function () {
  var location = {};
  var randomLocationX = getRandomInt(300, 900);
  var randomLocationY = getRandomInt(130, 630);
  location.x = randomLocationX - PIN_WIDTH / 2;
  location.y = randomLocationY - PIN_HEIGHT;
  return 'left: ' + location.x + 'px, top: ' + location.y + 'px;';
};

var makeOfferPrice = function () {
  var randomOfferPrice = getRandomInt(1000, 1000000);
  return `${randomOfferPrice}₽/ночь`;
};

console.log();


var makeOfferRooms = function () {
  var randomOfferRooms = clamp(Math.floor(Math.random() * 10), 1, 5);
  return randomOfferRooms;
};

var makeOfferGuests = function () {
  var randomOfferGuests = clamp(Math.floor(Math.random() * 10), 1, 100);
  return randomOfferGuests;
};

var combineOfferRoomsAndGuests = function () {
  var rooms = makeOfferRooms();
  var guests = makeOfferGuests();
  return `${rooms} комнаты для ${guests} гостей.`
};

var makeOfferTiming = function () {
  var randomCheckinIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKIN.length - 1);
  var randomCheckoutIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKOUT.length - 1);
  return `Заезд после ${OFFER_CHECKIN[randomCheckinIndex]}, выезд до ${OFFER_CHECKOUT[randomCheckoutIndex]}.`
};

var makeRandomOfferFeatures = function () {
  var randomFeatureIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_FEATURES.length - 1);
  var arr = [];
  for (var i = 0; i <= randomFeatureIndex; i++) {
    arr[i] = OFFER_FEATURES[i];

  }
  return arr.toString();
};

console.log(makeRandomOfferFeatures());


//var suffleOfferPhotos = function (arr) {
//  return arr.sort(function() { return 0.5 - Math.random() }); //Uncaught TypeError: Cannot read property 'sort' of undefined
//};

//console.log(suffleOfferPhotos(OFFER_PHOTOS));

var findMap = document.querySelector('.map');

findMap.classList.remove('.map--faded');

var similarElementPositon = document.querySelector('.map__pins');

var similarElementTemplate = document.querySelector('template')
  .content;

var similarOfferCard = similarElementTemplate.querySelector('.map__card');

var similarOfferPin = similarElementTemplate.querySelector('.map__pin');
//map.js:152 Uncaught TypeError: Cannot read property 'cloneNode' of undefined
//     at createOfferPin (map.js:152)
//     at createPinFragment (map.js:162)
//     at map.js:197
// createOfferPin @ map.js:152
// createPinFragment @ map.js:162
// (anonymous) @ map.js:197

var createOfferPin = function () {
  var pinElement = similarOfferPin.cloneNode(true);
  pinElement.querySelector.style = makeOfferAddress();
  pinElement.querySelector('img').src = author.avatar(); // Сделать неповторяющимися
  pinElement.querySelector('alt').textContent = offer.title; // Сделать неповторяющимися
  return pinElement;
};

var createPinFragment = function () {
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    pinFragment.appendChild(createOfferPin());
  }
  return pinFragment;
};

var createOfferCard = function () {
  var cardElement = similarOfferCard.cloneNode(true);
  //cardElement.querySelector('.popup__title').textContent = offer.title; // Сделать неповторяющимися
  cardElement.querySelector('.popup__text--address').textContent = makeOfferAddress();
  cardElement.querySelector('.popup__text--price').textContent = makeOfferPrice();
  cardElement.querySelector('.popup__text--capacity').textContent = combineOfferRoomsAndGuests();
  cardElement.querySelector('.popup__text--time').textContent = makeOfferTiming();
  cardElement.querySelector('.popup__features').textContent = makeRandomOfferFeatures(); // Переделать под список
  cardElement.querySelector('.popup__description').textContent = OFFER_DESCRIPTION;
//  cardElement.querySelector('.popup__photos img').src = suffleOfferPhotos();
//  cardElement.querySelector('popup__avatar img').src = author.avatar();
  //map.js:177 Uncaught TypeError: Cannot set property 'src' of null
  //     at createOfferCard (map.js:177)
  //     at createCardFragment (map.js:184)
  //     at map.js:189
  // createOfferCard @ map.js:177
  // createCardFragment @ map.js:184
  // (anonymous) @ map.js:189
  return cardElement;
};

var createCardFragment = function () {
  var cardFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    cardFragment.appendChild(createOfferCard());
  }
  return cardFragment;
};

similarElementPositon.appendChild(createCardFragment());
similarElementPositon.appendChild(createPinFragment());


