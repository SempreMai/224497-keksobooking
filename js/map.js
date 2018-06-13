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

var makeRandomOfferLocationX = function () {
  var randomLocationX = getRandomInt(300, 900);
  return randomLocationX - PIN_WIDTH / 2;
};

var makeRandomOfferLocationY = function () {
  var randomLocationY = getRandomInt(130, 630);
  return randomLocationY - PIN_HEIGHT;
};

var combineOfferAddress = function () {
  return `${makeRandomOfferLocationX()}, ${makeRandomOfferLocationY()}`;
};

var makeRandomOfferPrice = function () {
  var randomOfferPrice = getRandomInt(1000, 1000000);
  return randomOfferPrice;
};

var makeRandomOfferType = function () {
  var randomTypeIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_TYPE.length - 1);
  return OFFER_TYPE[randomTypeIndex];
};

var makeRandomOfferRooms = function () {
  return clamp(Math.floor(Math.random() * 10), 1, 5);
};

var makeRandomOfferGuests = function () {
  return clamp(Math.floor(Math.random() * 10), 1, 100);
};

var makeRandomOfferCheckIn = function () {
  var randomCheckInIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKIN.length - 1);
  return OFFER_CHECKIN[randomCheckInIndex];
};

var makeRandomOfferCheckOut = function () {
  var randomCheckOutIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKOUT.length - 1);
  return OFFER_CHECKOUT[randomCheckOutIndex];
};

var makeRandomOfferFeatures = function () {
  var randomFeatureIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_FEATURES.length - 1);
  var arr = [];
  for (var i = 0; i <= randomFeatureIndex; i++) {
    arr[i] = OFFER_FEATURES[i];
  }
  return arr;
};

var mixedOfferPhotos = function () {
  return OFFER_PHOTOS.sort(function() { return 0.5 - Math.random() });
};

var generateOfferData = function (x) {
  return {
    author: {
      avatar: 'img/avatars/user0' + x + '.png'
    },
    offer: {
      title: OFFER_TITLE[x],
      address: combineOfferAddress(),
      price: makeRandomOfferPrice(),
      type: makeRandomOfferType(),
      rooms: makeRandomOfferRooms(),
      guests: makeRandomOfferGuests(),
      checkin: makeRandomOfferCheckIn(),
      checkout: makeRandomOfferCheckOut(),
      features: makeRandomOfferFeatures(),
      description: OFFER_DESCRIPTION,
      photos: mixedOfferPhotos()
    },
    location: {
      x: makeRandomOfferLocationX(),
      y: makeRandomOfferLocationY()
    }
  };
};

var generateOffersData = function () {
  var offerData = [];
  for (var i = 1; i <= OFFERS_NUMBER; i++) {
    offerData.push(generateOfferData(i));
  }
  return offerData;
};

var findMap = document.querySelector('.map');

findMap.classList.remove('.map--faded');

var similarElementPosition = document.querySelector('.map__pins');

var similarElementTemplate = document.querySelector('template')
  .content;

var similarOfferCard = similarElementTemplate.querySelector('.map__card');

var similarOfferPin = similarElementTemplate.querySelector('.map__pin');

var offersDataArray = generateOffersData();

console.log(offersDataArray);

var createOfferPin = function () {
  var pinElement = similarOfferPin.cloneNode(true);
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    pinElement.querySelector.style = `left: ${offersDataArray[i].location.x}px; top: ${offersDataArray[i].location.y}px`;
    pinElement.querySelector('img').src = offersDataArray[i].author.avatar;
    pinElement.querySelector('img').alt = offersDataArray[i].offer.title;
    return pinElement;
  }
};

var createOfferCard = function () {
  var cardElement = similarOfferCard.cloneNode(true);
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    cardElement.querySelector('.popup__title').textContent = offersDataArray[i].offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offersDataArray[i].offer.address;
    cardElement.querySelector('.popup__text--price').textContent = `${offersDataArray[i].offer.price}₽/ночь`;
    cardElement.querySelector('.popup__type').textContent = offersDataArray[i].offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = `${offersDataArray[i].offer.rooms} комнаты для ${offersDataArray[i].offer.guests} гостей.`;
    cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${offersDataArray[i].offer.checkin}, выезд до ${offersDataArray[i].offer.checkout}.`;
    //cardElement.querySelector('.popup__features').textContent = makeRandomOfferFeatures(); // Переделать под список
    cardElement.querySelector('.popup__description').textContent = offersDataArray[i].offer.description;
    //cardElement.querySelector('.popup__photos > img').src = offersDataArray[i].offer.photos;
    cardElement.querySelector('.popup__avatar').src = offersDataArray[i].author.avatar;
  }
  return cardElement;
};

var createCardFragment = function () {
  var cardFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    cardFragment.appendChild(createOfferCard());
  }
  return cardFragment;
};

var createPinFragment = function () {
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFERS_NUMBER; i++) {
    pinFragment.appendChild(createOfferPin());
  }
  return pinFragment;
};

similarElementPosition.appendChild(createCardFragment());
similarElementPosition.appendChild(createPinFragment());


