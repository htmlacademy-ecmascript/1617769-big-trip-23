import {
  getRandomArrayElement,
  getID,
  getRandomInt,
  getRandomBoolean,
  getDateWithRandomTime
} from './mock-utils';
import { POINT_COUNT, POINT_TYPES, SELECTED_OFFERS_LIMIT } from '../const';
import { getRandomDestination } from './destination';
import { getMockedOffers } from './offer-mock';

const pointID = getID();

const mockedOffers = getMockedOffers();

const createMockPoint = () => {
  const { id: destinationId } = getRandomDestination();
  const dateStart = getDateWithRandomTime();
  const dateEnd = getDateWithRandomTime(dateStart);
  const type = getRandomArrayElement(POINT_TYPES);
  const offersByType = mockedOffers.find((offer) => offer.type === type);
  const offers = offersByType.offers > 0
    ? Array.from({ length: getRandomInt(SELECTED_OFFERS_LIMIT) }, () => getRandomArrayElement(offersByType.offers))
    : [];
  const offerIDs = offers.length > 0 ? offers.map((offer) => offer.id) : [];

  return {
    id: pointID(),
    type: type,
    dateFrom: dateStart,
    dateTo: dateEnd,
    destination: destinationId, // исправить
    price: getRandomInt(1000),
    isFavorite: getRandomBoolean(),
    offers: offerIDs,
  };
};

const getMockedPoints = () => Array.from({ length: POINT_COUNT}, createMockPoint);


export { getMockedPoints };

