import { getMockedPoints } from '../mock/point-mock';
import { getMockedDestinations } from '../mock/destination';
import { getMockedOffers } from '../mock/offer-mock';
import { getRandomBoolean } from '../utils/common';


export default class PointModel {
  #tripPoints = null;
  #destinations = null;
  #offers = null;

  constructor() {
    this.#destinations = getMockedDestinations();
    this.#offers = getMockedOffers();
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
}
