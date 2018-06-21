'use strict';

var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var PIN_MAIN_HEIGHT = 44;
var PIN_MAIN_QUANTITY = 1;

var OFFERS_QUANTITY = 8;

var OFFER_DESCRIPTION = '';

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_CHECK_HOURS = [
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

var locationSettings = {
  x: {
    MIN: 300,
    MAX: 900,
  },
  y: {
    MIN: 130,
    MAX: 630,
  }
};

var offerSettings = {
  type: {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
  },
  price: {
    MIN: 1000,
    MAX: 1000000,
  },
  guestsNumber: {
    MIN: 1,
    MAX: 100,
  },
  roomsNumber: {
    MIN: 1,
    MAX: 5,
  },
};

var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;
var PHOTO_ALT = 'Фотография жилья';

var mapElement = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinMainElement = mapPinsElement.querySelector('.map__pin--main');

var offerFormElement = document.querySelector('.ad-form');
var offerFormFieldsets = offerFormElement.querySelectorAll('.ad-form__element');
var offerFormInputAddress = offerFormElement.querySelector('#address');
var offerFormButtonSubmit = offerFormElement.querySelector('.ad-form__submit');

var offerTemplate = document.querySelector('template').content;
var offerCardElement = offerTemplate.querySelector('.map__card');
var offerPinElement = offerTemplate.querySelector('.map__pin');

var removeChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var initialLocation = function () {
  return (locationSettings.x.MAX / 2 - (PIN_WIDTH / 2)) + ', ' + ((locationSettings.y.MAX / 2) - (PIN_MAIN_HEIGHT / 2));
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var getRandomArrayItem = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};

var createAvatarPath = function (offerIndex) {
  return AVATAR_FOLDER_PATH + '0' + (offerIndex + 1) + AVATAR_FILE_TYPE;
};

var sliceArrayRandomly = function (array) {
  return array.slice(0, getRandomInt(0, array.length - 1));
};

var shuffleArray = function (array) {
  return array.sort(function () {
    return 0.5 - Math.random();
  });
};

var generateOfferData = function (offerIndex) {
  var locationX = getRandomInt(locationSettings.x.MIN, locationSettings.x.MAX);
  var locationY = getRandomInt(locationSettings.y.MIN, locationSettings.y.MAX);
  return {
    author: {
      avatar: createAvatarPath(offerIndex)
    },
    offer: {
      title: OFFER_TITLES[offerIndex],
      address: locationX + ', ' + locationY,
      price: getRandomInt(offerSettings.price.MIN, offerSettings.price.MIN),
      type: getRandomArrayItem(Object.keys(offerSettings.type)),
      rooms: getRandomInt(offerSettings.roomsNumber.MIN, offerSettings.roomsNumber.MAX),
      guests: getRandomInt(offerSettings.guestsNumber.MIN, offerSettings.guestsNumber.MIN),
      checkin: getRandomArrayItem(OFFER_CHECK_HOURS),
      checkout: getRandomArrayItem(OFFER_CHECK_HOURS),
      features: sliceArrayRandomly(OFFER_FEATURES),
      description: OFFER_DESCRIPTION,
      photos: shuffleArray(OFFER_PHOTOS),
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

var generateAdverts = function () {
  var offersData = [];
  for (var i = 0; i < OFFERS_QUANTITY; i++) {
    offersData.push(generateOfferData(i));
  }
  return offersData;
};

var createPhotoElement = function (path) {
  var photoElement = document.createElement('img');
  photoElement.classList.add('popup__photo');
  photoElement.width = PHOTO_WIDTH;
  photoElement.height = PHOTO_HEIGHT;
  photoElement.alt = PHOTO_ALT;
  photoElement.src = path;
  return photoElement;
};

var createFeaturesElement = function (feature) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  featureElement.classList.add('popup__feature--' + feature);
  return featureElement;
};

var createCardElement = function (advert) {
  var cardElement = offerCardElement.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = advert.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = offerSettings.type[advert.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей.';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout + '.';
  cardElement.querySelector('.popup__description').textContent = advert.offer.description;
  cardElement.querySelector('.popup__avatar').src = advert.author.avatar;

  var photosElement = cardElement.querySelector('.popup__photos');
  removeChildren(photosElement);

  advert.offer.photos.forEach(function (photoPath) {
    photosElement.appendChild(createPhotoElement(photoPath));
  });

  var featuresElement = cardElement.querySelector('.popup__features');
  removeChildren(featuresElement);

  advert.offer.features.forEach(function (feature) {
    featuresElement.appendChild(createFeaturesElement(feature));
  });

  cardElement.querySelector('.popup__close').addEventListener('click', function () {
    mapPinsElement.removeChild(cardElement);
  });

  return cardElement;
};

var createPinElement = function (offerData) {
  var pinElement = offerPinElement.cloneNode(true);
  pinElement.style.left = (offerData.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (offerData.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = offerData.author.avatar;
  pinElement.querySelector('img').alt = offerData.offer.title;
  pinElement.addEventListener('click', function () {
    var cardElement = mapPinsElement.querySelector('.map__card');
    if (cardElement) {
      mapPinsElement.removeChild(cardElement);
    }
    mapPinsElement.appendChild(createCardElement(offerData));
  });
  return pinElement;
};

var createPinFragment = function (offers) {
  var pinFragment = document.createDocumentFragment();
  var mapPinElements = mapPinsElement.querySelectorAll('.map__pin');
  offers.forEach(function (offerData) {
    if (mapPinElements.length === PIN_MAIN_QUANTITY) {
      pinFragment.appendChild(createPinElement(offerData));
    }
  });
  return pinFragment;
};

var activateOfferForm = function () {
  offerFormElement.classList.remove('ad-form--disabled');

  offerFormFieldsets.forEach(function (element) {
    element.disabled = false;
  });
  offerFormButtonSubmit.disabled = false;
};

var onMapMainPinMouseUp = function () {
  var adverts = generateAdverts();
  mapPinsElement.appendChild(createPinFragment(adverts));
  mapElement.classList.remove('map--faded');
  activateOfferForm();
};

mapPinMainElement.addEventListener('mouseup', onMapMainPinMouseUp);

var deactivateOfferForm = function () {
  mapElement.classList.add('map--faded');
  offerFormElement.classList.add('ad-form--disabled');
  offerFormInputAddress.value = initialLocation();
  offerFormFieldsets.forEach(function (element) {
    element.disabled = true;
  });
  offerFormButtonSubmit.disabled = true;
};

deactivateOfferForm();
