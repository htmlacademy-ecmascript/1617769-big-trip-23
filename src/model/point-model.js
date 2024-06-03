import { getMockedPoints } from '../mock/point-mock';
import { getMockedDestinations } from '../mock/destination';
import { getMockedOffers } from '../mock/offer-mock';
import { FilterType, SortTypes } from '../const';
import { sortByDay, sortByTime, sortByPrice } from '../view/utils/common';
import Observable from '../framework/observable';

export default class PointModel extends Observable{
  #tripPoints = [];
  #destinations = [];
  #offers = [];
  #filters = [];
  #sortTypes = [];
  #defaultFilter = FilterType.EVERYTHING;
  #defaultSortType = SortTypes.DAY;
  #currentFilter = this.#defaultFilter;
  #currentSort = this.#defaultSortType;

  init() {
    this.destinations = getMockedDestinations();
    this.offers = getMockedOffers();
    this.tripPoints = getMockedPoints();
    this.#filters = Object.values(FilterType);
    this.#sortTypes = Object.values(SortTypes);
  }

  get tripPoints() {
    const filteredTripPoints = this.#getFilteredTripPoints(this.#tripPoints, this.currentFilter);
    return this.#getSortedTripPoints(filteredTripPoints, this.currentSort);
  }

  set tripPoints(tripPoints) {
    this.#tripPoints = tripPoints;
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  get filters() {
    return this.#filters;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  set currentFilter(filter) {
    if (filter === this.#currentFilter) {
      return;
    }
    this.#currentFilter = filter;

    this._notify();
  }

  get currentSort() {
    return this.#currentSort;
  }

  set currentSort(sortType) {
    if (sortType === this.#currentSort) {
      return;
    }
    this.#currentSort = sortType;
    this._notify();
  }

  get tripInfo() {
    const tripInfo = this.#getSortedTripPoints(this.#tripPoints, this.#defaultSortType);
    const firstPoint = tripInfo[tripInfo.length - 1];
    const lastPoint = tripInfo[0];
    const middlePoint = tripInfo.slice(1, -1);
    const middleDestination = middlePoint.length === 1 ? this.#getDestinationName(middlePoint[0].destination) : '...';
    return {
      start: this.#getDestinationName(firstPoint.destination),
      middle: middleDestination,
      end: this.#getDestinationName(lastPoint.destination),
      dateFrom: firstPoint.dateFrom,
      dateTo: lastPoint.dateTo,
      cost: tripInfo.reduce((price, tripPoint) => price + tripPoint.price, 0),
    };
  }

  #getSortedTripPoints = (tripPoints, sortType) => {
    switch (sortType) {
      case SortTypes.DAY:
        return tripPoints.sort(sortByDay);
      case SortTypes.TIME:
        return tripPoints.sort(sortByTime);
      case SortTypes.PRICE:
        return tripPoints.sort(sortByPrice);
      default:
        return new Error(`Invalid sort type: ${sortType}`);
    }
  };

  #getFilteredTripPoints = (tripPoints, filter) => {
    const currentDate = new Date();
    switch (filter) {
      case FilterType.EVERYTHING:
        return [...tripPoints];
      case FilterType.FUTURE:
        return tripPoints.filter((tripPoint) => tripPoint.dateFrom > currentDate);
      case FilterType.PRESENT:
        return tripPoints.filter((tripPoint) => tripPoint.dateFrom >= currentDate && tripPoint.dateTo <= currentDate);
      case FilterType.PAST:
        return tripPoints.filter((tripPoint) => tripPoint.dateTo < currentDate);
      default:
        throw new Error(`Invalid filter : ${filter}`);
    }
  };

  #getDestinationName = (id) => this.#destinations.find((destination) => destination.id === id).name;
}
