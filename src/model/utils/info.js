import { isEmpty } from '../../utils/common';
import { getTypedOffers, getDestination, getOffer } from './common';

const getDestinationName = (destinations, destinationId) => {
  const currentDestination = getDestination(destinations, destinationId);
  return currentDestination ? currentDestination.name : '';
};

const getOfferCost = (point, offers) => {
  const typedOffers = getTypedOffers(offers, point.type).offers;
  return point.offers.reduce((price, offerId) => price + getOffer(typedOffers, offerId).price , 0);
};

const getInfo = (trip, destinations, offers) => {
  if (isEmpty(trip)) {
    return {};
  }

  const first = trip[0];
  const last = trip[trip.length - 1];
  const middle = trip.slice(1, -1);
  const middleDestination = middle.length === 1 ? getDestinationName(destinations, middle[0]?.destination) : '...';
  return {
    start: getDestinationName(destinations, first.destination),
    middle: middleDestination,
    end: getDestinationName(destinations, last.destination),
    dateFrom: first.dateFrom,
    dateTo: last.dateTo,
    cost: trip.reduce(
      (price, point) => price + point.basePrice + getOfferCost(point, offers), 0),
  };
};

export { getInfo };
