'use strict';

(function () {
  var deactivatePins = window.page.deactivatePins;
  var deleteOfferCard = window.page.deleteOfferCard;
  var getOffers = window.offers.get;
  var renderPins = window.map.renderPins;
  var debounce = window.debounce.set;
  var getSelectedOption = window.utils.getSelectedOption;
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HousingPrice = {
    LOW: 10000,
    HIGH: 50000
  };
  var FilterValue = {
    LOW: 'low',
    HIGH: 'high',
    MIDDLE: 'middle',
    ANY: 'any'
  };

  var filtersForm = document.querySelector('.map__filters');
  var filterHouseType = filtersForm.querySelector('select[name = housing-type]');
  var filterPrice = filtersForm.querySelector('select[name = housing-price]');
  var filterRoomsNumber = filtersForm.querySelector('select[name = housing-rooms]');
  var filterGuestsNumber = filtersForm.querySelector('select[name = housing-guests]');

  var checkOfferPriceRange = function (offer) {
    var price = parseInt(offer.offer.price, 10);
    if (price < HousingPrice.LOW) {
      return FilterValue.LOW;
    } else if (price > HousingPrice.HIGH) {
      return FilterValue.HIGH;
    } else if (price >= HousingPrice.LOW && price <= HousingPrice.HIGH) {
      return FilterValue.MIDDLE;
    } else {
      return FilterValue.ANY;
    }
  };

  var filterByOfferType = function (offer) {
    if (getSelectedOption(filterHouseType).value === FilterValue.ANY) {
      return true;
    } else {
      return offer.offer.type === getSelectedOption(filterHouseType).value;
    }
  };

  var filterByPriceRange = function (offer) {
    if (getSelectedOption(filterPrice).value === FilterValue.ANY) {
      return true;
    } else {
      return checkOfferPriceRange(offer) === getSelectedOption(filterPrice).value;
    }
  };

  var filterByRoomsNumber = function (offer) {
    if (getSelectedOption(filterRoomsNumber).value === FilterValue.ANY) {
      return true;
    } else {
      return offer.offer.rooms === parseInt((getSelectedOption(filterRoomsNumber).value), 10);
    }
  };

  var filterByGuestsNumber = function (offer) {
    if (getSelectedOption(filterGuestsNumber).value === FilterValue.ANY) {
      return true;
    } else {
      return offer.offer.guests === parseInt((getSelectedOption(filterGuestsNumber).value), 10);
    }
  };

  var filterByFeature = function (feature) {
    return function (offer) {
      var featureElement = filtersForm.querySelector('input[value = ' + feature + ']');
      if (!featureElement.checked) {
        return true;
      } else {
        return offer.offer.features.includes(feature);
      }
    };
  };

  var getFilteredOffers = function () {
    var filteredOffers = getOffers()
    .filter(filterByOfferType)
    .filter(filterByPriceRange)
    .filter(filterByRoomsNumber)
    .filter(filterByGuestsNumber);

    for (var featureIndex = 0; featureIndex < OFFER_FEATURES.length; featureIndex++) {
      filteredOffers = filteredOffers.filter(filterByFeature(OFFER_FEATURES[featureIndex]));
    }

    return filteredOffers;
  };

  var updatePins = function () {
    deleteOfferCard();
    deactivatePins();
    var filteredOffers = getFilteredOffers();
    renderPins(filteredOffers);
  };

  var onFilterChange = function (evt) {
    if (evt.target && evt.target.matches('select.map__filter') || evt.target.matches('input[name = features]')) {
      var debouncedPinsUpdate = debounce(updatePins);
      debouncedPinsUpdate();
    }
  };

  var addFiltersFormListener = function () {
    filtersForm.addEventListener('change', onFilterChange);
  };

  var resetFiltersForm = function () {
    filtersForm.removeEventListener('change', onFilterChange);
    filtersForm.reset();
  };

  window.filter = {
    updatePins: updatePins,
    element: filtersForm,
    addListener: addFiltersFormListener,
    reset: resetFiltersForm
  };

})();
