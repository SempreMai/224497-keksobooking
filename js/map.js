'use strict';

var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
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
var adverts = generateAdverts();

var deletePinFragment = function (element) {
  var children = element.children;
  for (var i = children.length - 1; i >= 2; i--) {
    var child = children[i];
    child.parentElement.removeChild(child);
  }
};

var offerFormElement = document.querySelector('.ad-form');
var offerFormFieldsets = offerFormElement.querySelectorAll('.ad-form__element');
var offerFormInputAddress = offerFormElement.querySelector('#address');
var offerFormSelectRooms = document.querySelector('#room_number');
var offerFormSelectGuests = document.querySelector('#capacity');
var offerFormButtonSubmit = document.querySelector('.ad-form__submit');
var offerFormSelectType = document.querySelector('#type');
var offerFormInputPrice = document.querySelector('#price');
var offerFormSelectTimeIn = document.querySelector('#timein');
var offerFormSelectTimeOut = document.querySelector('#timeout');
var mapPinMainImg = document.querySelector('.map__pin--main > img');

var typePrice = {
  bungalo: {
    MIN: '0',
  },
  flat: {
    MIN: '1000',
  },
  house: {
    MIN: '5000',
  },
  palace: {
    MIN: '10000',
  },
};


var setPrice = function (propertyType) {
  offerFormInputPrice.min = typePrice[propertyType].MIN;
  offerFormInputPrice.placeholder = typePrice[propertyType].MIN;
};

var roomsCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0'],
};

var setCapacity = function (roomsNumber) {
  var capacityOptions = offerFormSelectGuests.options;
  for (var i = 0; i < capacityOptions.length; i++) {
    var option = capacityOptions[i];
    option.disabled = !roomsCapacity[roomsNumber].includes(option.value);
  }
  if (capacityOptions[offerFormSelectGuests.selectedIndex].disabled) {
    offerFormSelectGuests.value = roomsCapacity[roomsNumber][0];
  }
};

var setTime = function (target, timeIndex) {
  if (target === offerFormSelectTimeIn) {
    offerFormSelectTimeOut.options[timeIndex].selected = true;
  } else if (target === offerFormSelectTimeOut) {
    offerFormSelectTimeIn.options[timeIndex].selected = true;
  }
};

var activateOfferForm = function () {
  offerFormElement.classList.remove('ad-form--disabled');

  offerFormFieldsets.forEach(function (element) {
    element.disabled = false;
  });
  offerFormButtonSubmit.disabled = false;
  // offerFormInputAddress.value = movePinMain(mapPinMainImg.x, mapPinMainImg.y);
};

var initPage = function () {
  mapPinsElement.appendChild(createPinFragment(adverts));
  mapElement.classList.remove('map--faded');
  activateOfferForm();
  setCapacity(offerFormSelectRooms.value);
  setPrice(offerFormSelectType.value);
  setTime(offerFormSelectTimeIn.selectedIndex);
};


var mainPinSettings = {
  defaultPosition: {
    LEFT: '599',
    TOP: '413',
  },
  verticalLimits: {
    MIN: '130',
    MAX: '630',
  },
  size: {
    inactive: {
      WIDTH: '199.95',
      HEIGHT: '199.95',
    },
    active: {
      WIDTH: '65',
      HEIGHT: '87',
    },
  },
};

var movePinMain = function (x, y) {
  mapPinMainElement.style.top = y + 'px';
  mapPinMainElement.style.left = x + 'px';
  // setAddress(calculateAddress());
  // console.log(setAddress(calculateAddress()));
};

// var calculateAddress = function () {
//   var address = {};
//   Object.defineProperty(address, 'x' {
//       return Math.round(x - (mainPinSettings.size.active / 2))
//   };f
//   set address(y) {
//     return Math.round(y - mainPinSettings.size.active)
//   },
// };

var setAddress = function (address) {
  offerFormInputAddress.value = address.x + ', ' + address.y;
};

mapPinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoordinates = {
    x: evt.clientX,
    y: evt.clientY,
  };

  var onMouseMove = function (moveEvt) {
    var shift = {
      x: startCoordinates.x - moveEvt.clientX,
      y: startCoordinates.y - moveEvt.clientY,
    };

    var newCoordinates = {
      x: moveEvt.clientX - shift.x,
      y: moveEvt.clientY - shift.y,
    };

    startCoordinates = {
      x: moveEvt.clientX,
      y: moveEvt.clientY,
    };

    movePinMain(newCoordinates.x, newCoordinates.y);
  };

  var onMouseUp = function () {
    initPage();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

offerFormSelectType.addEventListener('change', function (evt) {
  setPrice(evt.target.value);
});

offerFormSelectRooms.addEventListener('change', function (evt) {
  setCapacity(evt.target.value);
});

offerFormSelectTimeIn.addEventListener('change', function (evt) {
  setTime(evt.target, evt.target.selectedIndex);
});

offerFormSelectTimeOut.addEventListener('change', function (evt) {
  setTime(evt.target, evt.target.selectedIndex);
});

var resetForm = function () {
  offerFormElement.reset();
  deletePinFragment(mapPinsElement);
  setPrice(offerFormSelectType.value);
  setCapacity(offerFormSelectRooms.value);
  setTime(offerFormSelectTimeIn.selectedIndex);
};

var deactivateOfferForm = function () {
  mapElement.classList.add('map--faded');
  offerFormElement.classList.add('ad-form--disabled');
  // offerFormInputAddress.value = movePinMain(mainPinSettings.defaultPosition.LEFT, mainPinSettings.defaultPosition.TOP);
  offerFormButtonSubmit.disabled = true;
  offerFormFieldsets.forEach(function (element) {
    element.disabled = true;
  });
};

var offerFormButtonReset = offerFormElement.querySelector('.ad-form__reset');
offerFormButtonReset.addEventListener('click', function (evt) {
  evt.preventDefault();
  resetForm();
  deactivateOfferForm();
});

resetForm();
deactivateOfferForm();

