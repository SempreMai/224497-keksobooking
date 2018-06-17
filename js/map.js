'use strict';

var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

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

var initialLocation = function () {
  return (locationSettings.x.MAX / 2 - (PIN_WIDTH / 2)).toString() + ', ' + ((locationSettings.y.MAX / 2) - PHOTO_HEIGHT).toString();
};

var mapElement = document.querySelector('.map');

var mapPinsElement = document.querySelector('.map__pins');

var mapPinMainElement = mapPinsElement.querySelector('.map__pin--main'); //

var offerFormElement = document.querySelector('.ad-form');

var offerFormFieldsets = offerFormElement.querySelectorAll('fieldset');

var offerFormInputAddress = offerFormElement.querySelector('#address');

var offerTemplate = document.querySelector('template').content;

var offerCardElement = offerTemplate.querySelector('.map__card');

var offerPinElement = offerTemplate.querySelector('.map__pin');


var removeChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
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

var createOfferPin = function (offerData) {
  var pinElement = offerPinElement.cloneNode(true);
  pinElement.style.left = (offerData.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (offerData.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = offerData.author.avatar;
  pinElement.querySelector('img').alt = offerData.offer.title;
  return pinElement;
};

var createPinFragment = function (offers) {
  var pinFragment = document.createDocumentFragment();
  offers.forEach(function (offerData) {
    pinFragment.appendChild(createOfferPin(offerData));
  });
  return pinFragment;
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

var getPropertyName = function (key, array) {
  for (key in array) {
    if (array.hasOwnProperty(key)) {
      var name = array[key];
    }
  }
  return name;
};

var createCardElement = function (advert) {
  var cardElement = offerCardElement.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = advert.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getPropertyName(advert.offer.type, offerSettings.type); // осталась проблема выбора варианта
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

  return cardElement;
};

var initMap = function () {
  var adverts = generateAdverts();
  mapPinsElement.appendChild(createCardElement(adverts[0]));
  mapPinsElement.appendChild(createPinFragment(adverts));
  mapElement.classList.remove('.map--faded');
  offerFormElement.classList.remove('ad-form--disabled');
  Array.from(offerFormFieldsets).forEach(function (element) { // Не уверена, что работает
    element.removeAttribute('disabled');
  });
  offerFormInputAddress.setAttribute('value', initialLocation());
};

var stopMap = function () {
  mapElement.classList.add('.map--faded');
  offerFormElement.classList.add('ad-form--disabled');
  Array.from(offerFormFieldsets).forEach(function (element) { // Не уверена, что работает
    element.setAttribute('disabled', 'disabled');
  });
};

var pinFragmentElement = createPinFragment();
var pinFragmentElements = pinFragmentElement.querySelectorAll('map__pin'); // Не понимаю, как найти созданные пины

console.log(pinFragmentElements);

mapPinMainElement.addEventListener('mouseup', initMap);


var disactivateSitePage = function (evt) {
  return evt;
};
