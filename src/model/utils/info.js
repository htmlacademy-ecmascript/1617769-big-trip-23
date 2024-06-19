import { isEmpty } from '../../utils/common';
import { getPointOffers, getDestination, getOffer } from './common';

const getDestinationName = (destinations, destinationId) => {
  const currentDestination = getDestination(destinations, destinationId);
  return currentDestination ? currentDestination.name : '';
};

const getOffersCost = (point, offers) => {
  const pointOffers = getPointOffers(offers, point.type).offers;
  return point.offers.reduce((price, offerId) => price + getOffer(pointOffers, offerId).price , 0);
};

const getInfo = (trip, destinations, offers) => {
  if (isEmpty(trip)) {
    return {};
  }

  const first = trip[0];
  const last = trip[trip.length - 1];
  const middle = trip.slice(1, -1);
  const middleDestination = middle.length === 1 ? getDestinationName(destinations, middle[0].destination) : '...';
  return {
    start: getDestinationName(destinations, first.destination),
    middle: middle.length ? middleDestination : '',
    end: getDestinationName(destinations, last.destination),
    dateFrom: first.dateFrom,
    dateTo: last.dateTo,
    cost: trip.reduce(
      (price, point) => price + point.basePrice + getOffersCost(point, offers), 0),
  };
};

export { getInfo };
