import { getMockedPoints } from '../mock/point-mock';
import { getMockedDestinations } from '../mock/destination';
import { getMockedOffers } from '../mock/offer-mock';
import { FilterType, SortTypes, UpdateType } from '../const';
import Observable from '../framework/observable';
import { FilteredTypes } from '../view/utils/filter';
import { SortedTypes } from '../view/utils/sort';
import { removeComponent } from '../view/utils/common';

export default class PointModel extends Observable{
  #tripPoints = [];
  #destinations = [];
  #offers = [];
  #filters = [];
  #defaultFilter = FilterType.EVERYTHING;
  #defaultSortType = SortTypes.DAY;
  #currentFilter = this.#defaultFilter;
  #currentSort = this.#defaultSortType;

  init() {
    this.destinations = getMockedDestinations();
    this.offers = getMockedOffers();
    this.tripPoints = getMockedPoints();
    this.#filters = Object.values(FilterType);
    this._notify(UpdateType.MAJOR);
  }

  get tripPoints() {
    const filteredTripPoints = this.#getFilteredTripPoints(this.#tripPoints, this.currentFilter);
    return this.#getSortedTripPoints(filteredTripPoints, this.currentSort);
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
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

  addTripPoint(updateType, tripPoint) {
    this.#tripPoints.push(tripPoint);
    this._notify(updateType, tripPoint);
  }

  updateTripPoint(updateType, tripPoint) {
    const checkedTripPoint = this.#findTripPoint(tripPoint.id);
    if (!checkedTripPoint) {
      throw new Error(`Can't update trip event ${tripPoint.id}`);
    }
    Object.assign(checkedTripPoint, tripPoint);
    this._notify(updateType, tripPoint);
  }

  deleteTripPoint(updateType, tripPoint) {
    const checkedTripPoint = this.#findTripPoint(tripPoint.id);
    if (!checkedTripPoint) {
      throw new Error(`Can't delete trip event ${tripPoint.id}`);
    }
    removeComponent(this.#tripPoints, checkedTripPoint);
    this._notify(updateType);
  }

  #getSortedTripPoints = (tripPoints, sortType) => tripPoints.sort(SortedTypes[sortType]);
  #getFilteredTripPoints = (tripPoints, filter) => tripPoints.filter(FilteredTypes[filter]);
  #getDestinationName = (id) => this.#destinations.find((destination) => destination.id === id).name;
  #findTripPoint = (id) => this.#tripPoints.find((tripPoint) => tripPoint.id === id);
}
