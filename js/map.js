'use strict';
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var OFFERS_NUMBER = 8;

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

var makeOfferAddress = function () {
  var location = {};
  var randomLocationX = getRandomInt(300, 900);
  var randomLocationY = getRandomInt(130, 630);
  location.x = randomLocationX - PIN_WIDTH / 2;
  location.y = randomLocationY - PIN_HEIGHT;
  return 'left: ' + location.x + 'px, top: ' + location.y + 'px;';
};

console.log(makeOfferAddress());

var makeOfferPrice = function () {
  var randomOfferPrice = getRandomInt(1000, 1000000);
  return randomOfferPrice;
};

console.log(makeOfferPrice());

var OFFER_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var makeOfferRooms = function () {
  var randomOfferRooms = clamp(Math.floor(Math.random() * 10), 1, 5);
  return randomOfferRooms;
};

var makeOfferGuests = function () {
  var randomOfferGuests = clamp(Math.floor(Math.random() * 10), 1, 100);
  return randomOfferGuests;
};

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

var makeRandomOfferFeatures = function () {
  var randomFeatureIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_FEATURES.length - 1);
  var arr = [];
  for (var i = 0; i <= randomFeatureIndex; i++) {
    arr[i] = OFFER_FEATURES[i];

  }
  return arr.toString();
};

console.log(makeRandomOfferFeatures());

var OFFER_DESCRIPTION = '';

var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var suffleOfferPhotos = function (arr) {
  return arr.sort(function() { return 0.5 - Math.random() });
};

console.log(suffleOfferPhotos(OFFER_PHOTOS));

var findMap = document.querySelector('.map');

findMap.classList.remove('.map--faded');

var similarListElement = findMap.querySelector('.map__card');

var similarItemTemplate = document.querySelector('.map__pin')
  .content;

var createPin = function () {
  var pinElement = similarItemTemplate.cloneNode(true);
  pinElement.querySelector(['style']).textContent = makeOfferAddress();
  //pinElement.querySelector(['src']).textContent =
};

