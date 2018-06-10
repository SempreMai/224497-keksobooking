'use strict';

var avatarsList = [];

var makeAvatarsImgArrow = function (arr) {
  for (var i = 1; i <= 8; i++) {
    var current = i;
    arr[i] += 'img/avatars/user0' + current + '.png';
  }
  return arr;
};

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

var offerAddress = [];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

var offerPrice = function () {
  var randomOfferPrice = clamp(Math.floor(Math.random() * 10), 1000, 1000000);
  return randomOfferPrice;
};

var OFFER_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var offerRooms = function () {
  var randomOfferRooms = clamp(Math.floor(Math.random() * 10), 1, 5);
  return randomOfferRooms;
};

var offerGuests = function () {
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
  for (var i = 0; i <= randomOfferFeatureIndex; i++) {
    arr[i] += OFFER_FEATURES[i];
  }
  return arr.toLocaleString(); //Почему-то распечатывает с ndefined перед каждым значением
};

var OFFER_DESCRIPTION = '';

var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var makeRandomOfferPhotos = function () {
  var randomPhotoIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_PHOTOS.length - 1);

};

console.log(makeRandomOfferFeatures());

var findMap = document.querySelector('.map');

findMap.classList.remove('.map--faded');
