import { getMockedPoints } from '../mock/point-mock';
import { getMockedDestinations } from '../mock/destination';
import { getMockedOffers } from '../mock/offer-mock';
import { getRandomBoolean } from '../utils/common';
import { FilterType } from '../const';

export default class PointModel {
  #tripPoints = [];
  #destinations = [];
  #offers = [];
  #filters = [];

  constructor() {
    this.#filters = Object.values(FilterType);
    this.#destinations = getMockedDestinations();
    this.#offers = getMockedOffers();
    // this.#tripPoints = []; //надо порефакторить модель
    this.#tripPoints = getMockedPoints().map((tripPoint) => {
      const { offers } = this.#offers.find((offer) => offer.type === tripPoint.type);

      return {
        ...tripPoint,
        destination: this.#destinations.find((dest) => dest.id === tripPoint.destination),
        offers: offers.map((offer) => ({
          type: tripPoint.type,
          ...offer,
          selected: getRandomBoolean(),
        })),
      };
    });
  }

  get tripPoints() {
    return this.#tripPoints;
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
}

