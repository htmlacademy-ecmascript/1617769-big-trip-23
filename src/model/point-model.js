
import { FilterType, SortTypes, UpdateType } from '../const'; //исправить
import { AUTHORIZATION, BASE_URL } from '../api/trip-api-const';
import { FilteredTypes } from '../view/utils/filter';
import { SortedTypes } from '../view/utils/sort';
import TripApiService from '../api/trip-api-service.ru';
import Observable from '../framework/observable';
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
  #tripApiService = new TripApiService(BASE_URL, AUTHORIZATION);

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

  get currentSort() {
    return this.#currentSort;
  }

  set currentSort(sortType) {
    this.#currentSort = sortType;
  }

  get tripInfo() {
    const tripInfo = this.#getSortedTripPoints(this.#tripPoints, this.#defaultSortType);
    const firstPoint = tripInfo[0];
    const lastPoint = tripInfo[tripInfo.length - 1];
    const middlePoint = tripInfo.slice(1, -1);
    const middleDestination = middlePoint.length === 1 ? this.#getDestinationName(middlePoint[0].destination) : '...';
    return {
      start: this.#getDestinationName(firstPoint.destination),
      middle: middleDestination,
      end: this.#getDestinationName(lastPoint.destination),
      dateFrom: firstPoint.dateFrom,
      dateTo: lastPoint.dateTo,
      cost: tripInfo.reduce((price, tripPoint) => price + tripPoint.basePrice, 0),
    };
  }

  async init() {
    try {
      this.#destinations = await this.#tripApiService.getDestinations();
      this.#offers = await this.#tripApiService.getOffers();
      this.#tripPoints = (await this.#tripApiService.getPoints()).map(TripApiService.adaptToClient);
      this._notify(UpdateType.MAJOR);
    } catch(error) {
      this._notify(UpdateType.ERROR);
      this.#destinations = [];
      this.#offers = [];
      this.#tripPoints = [];
    }
    this.#filters = Object.values(FilterType);
    this._notify(UpdateType.MAJOR);
  }

  setCurrentFilter(updateType, filterType) {
    this.#currentFilter = filterType;
    this._notify(updateType, filterType);
  }

  async addTripPoint(updateType, tripPoint) {
    try {
      const newTripPoint = await this.#tripApiService.addPoint(tripPoint);
      this.#tripPoints.push(newTripPoint);
      this._notify(updateType, newTripPoint);
    } catch(error) {
      throw new Error(error);
    }
  }

  async updateTripPoint(updateType, tripPoint) {
    const selectedTripPoint = this.#findTripPoint(tripPoint.id);
    if (!selectedTripPoint) {
      throw new Error(`Can't update trip event ${tripPoint.id}`);
    }

    try {
      const updatedTripPoint = await this.#tripApiService.updatePoint(tripPoint);
      Object.assign(selectedTripPoint, updatedTripPoint);
      this._notify(updateType, tripPoint);
    } catch(error) {
      throw new Error(error);
    }
  }

  async deleteTripPoint(updateType, tripPoint) {
    const selectedTripPoint = this.#findTripPoint(tripPoint.id);
    if (!selectedTripPoint) {
      throw new Error(`Can't delete trip event ${tripPoint.id}`);
    }
    try {
      await this.#tripApiService.deletePoint(tripPoint);
    } catch(error) {
      throw new Error(error);
    }
    this.#tripPoints = removeComponent(this.#tripPoints, selectedTripPoint);
    this._notify(updateType);
  }

  #getSortedTripPoints = (tripPoints, sortType) => tripPoints.sort(SortedTypes[sortType]);
  #getFilteredTripPoints = (tripPoints, filter) => tripPoints.filter(FilteredTypes[filter]);
  #getDestinationName = (id) => this.#destinations.find((destination) => destination.id === id).name;
  #findTripPoint = (id) => this.#tripPoints.find((tripPoint) => tripPoint.id === id);
}


