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

var MINIMUM_X_COORDINATE = 300;
var MAXIMUM_X_COORDINATE = 900;
var MINIMUM_Y_COORDINATE = 130;
var MAXIMUM_Y_COORDINATE = 630;

var MINIMUM_OFFER_PRICE = 1000;
var MAXIMUM_OFFER_PRICE = 1000000;

var MAXIMUM_GUESTS_QUANTITY = 100;
var MAXIMUM_ROOMS_QUANTITY = 5;

var findMap = document.querySelector('.map');

findMap.classList.remove('.map--faded');

var similarElementPosition = document.querySelector('.map__pins');

var similarElementTemplate = document.querySelector('template')
  .content;

var similarOfferCard = similarElementTemplate.querySelector('.map__card');

var similarOfferPin = similarElementTemplate.querySelector('.map__pin');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var createRandomOfferLocationX = function () {
  var randomLocationX = getRandomInt(MINIMUM_X_COORDINATE, MAXIMUM_X_COORDINATE);
  return randomLocationX - PIN_WIDTH / 2;
};

var createRandomOfferLocationY = function () {
  var randomLocationY = getRandomInt(MINIMUM_Y_COORDINATE, MAXIMUM_Y_COORDINATE);
  return randomLocationY - PIN_HEIGHT;
};

var combineOfferAddress = function () {
  return createRandomOfferLocationX() + ', ' + createRandomOfferLocationY();
};

var createRandomOfferPrice = function () {
  return getRandomInt(MINIMUM_OFFER_PRICE, MAXIMUM_OFFER_PRICE);
};

var createRandomOfferType = function () {
  var randomTypeIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_TYPE.length - 1);
  return OFFER_TYPE[randomTypeIndex];
};

var createRandomOfferRooms = function () {
  return clamp(Math.floor(Math.random() * 10), 1, MAXIMUM_ROOMS_QUANTITY);
};

var createRandomOfferGuests = function () {
  return clamp(Math.floor(Math.random() * 10), 1, MAXIMUM_GUESTS_QUANTITY);
};

var createRandomOfferCheckIn = function () {
  var randomCheckInIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKIN.length - 1);
  return OFFER_CHECKIN[randomCheckInIndex];
};

var createRandomOfferCheckOut = function () {
  var randomCheckOutIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_CHECKOUT.length - 1);
  return OFFER_CHECKOUT[randomCheckOutIndex];
};

var createRandomOfferFeatures = function () {
  var randomFeatureIndex = clamp(Math.floor(Math.random() * 10), 0, OFFER_FEATURES.length - 1);
  var ranomFeaturesArray = [];
  for (var i = 0; i <= randomFeatureIndex; i++) {
    ranomFeaturesArray.push(OFFER_FEATURES[i]);
  }
  return ranomFeaturesArray;
};

var createOfferFeaturesList = function () {
  var randomFeaturesArray = createRandomOfferFeatures();
  var featureFragment = document.createDocumentFragment();
  for (var i = 0; i < randomFeaturesArray.length; i++) {
    var newFeature = document.createElement('li');
    newFeature.className = 'popup__feature--' + randomFeaturesArray[i];
    newFeature.textContent = randomFeaturesArray[i];
    featureFragment.appendChild(newFeature);
  }
  return featureFragment;
};

var mixedOfferPhotos = function () {
  return OFFER_PHOTOS.sort(function() { return 0.5 - Math.random() });
};

var addOfferPhotos = function () {
  var randomPhotosArray = mixedOfferPhotos();
  var photoFragment = document.createDocumentFragment();
  for (var i = 0; i < randomPhotosArray.length; i++) {
    var newPhoto = document.createElement('img');
    newPhoto.src = randomPhotosArray[i];
    photoFragment.appendChild(newPhoto);
  }
  return photoFragment;
};

var removeEmptyOfferPhoto = function () { // Не знаю, куда вставить эту функцию!!!((
  var offerPhotosContainer = similarOfferCard.querySelector('.popup__photos');
  var offerPhoto = offerPhotosContainer.querySelectorAll('img');
  offerPhotosContainer.removeChild(offerPhoto[0]);
};

var generateOfferData = function (offerIndex) {
  return {
    author: {
      avatar: 'img/avatars/user0' + offerIndex + '.png'
    },
    offer: {
      title: OFFER_TITLE[offerIndex],
      address: combineOfferAddress(),
      price: createRandomOfferPrice(),
      type: createRandomOfferType(),
      rooms: createRandomOfferRooms(),
      guests: createRandomOfferGuests(),
      checkin: createRandomOfferCheckIn(),
      checkout: createRandomOfferCheckOut(),
      features: createOfferFeaturesList(),
      description: OFFER_DESCRIPTION,
      photos: addOfferPhotos()
    },
    location: {
      x: createRandomOfferLocationX(),
      y: createRandomOfferLocationY()
    }
  };
};

var generateOffersData = function () {
  var offersData = [];
  for (var i = 1; i <= OFFERS_NUMBER; i++) {
    offersData.push(generateOfferData(i));
  }
  return offersData;
};

var offersDataArray = generateOffersData();

var createOfferPin = function (offerData) {
  var pinElement = similarOfferPin.cloneNode(true);
  pinElement.style.left = offerData.location.x + 'px';
  pinElement.style.top = offerData.location.y + 'px';
  pinElement.querySelector('img').src = offerData.author.avatar;
  pinElement.querySelector('img').alt = offerData.offer.title;
  return pinElement;
};

var createPinFragment = function () {
  var pinFragment = document.createDocumentFragment();
  offersDataArray.forEach(function (offerData) {
    pinFragment.appendChild(createOfferPin(offerData));
  });
  return pinFragment;
};

var createOfferCard = function (offerData) {
  var cardElement = similarOfferCard.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = offerData.offer.title; // Почему-то не отображается!
  cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = offerData.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout + '.';
  cardElement.querySelector('.popup__features').appendChild(offerData.offer.features);
  cardElement.querySelector('.popup__description').textContent = offerData.offer.description;
  cardElement.querySelector('.popup__photos').appendChild(offerData.offer.photos); // Не знаю, где вызвать removeEmptyOfferPhoto
  cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
  return cardElement;
};

var createCardFragment = function () {
  var cardFragment = document.createDocumentFragment();
  offersDataArray.forEach(function (offerData) {
    cardFragment.appendChild(createOfferCard(offerData));
  });
  return cardFragment;
};

similarElementPosition.appendChild(createCardFragment());
similarElementPosition.appendChild(createPinFragment());


