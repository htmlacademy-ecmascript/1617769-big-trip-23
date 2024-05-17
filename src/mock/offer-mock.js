import { getRandomArrayElement, getID, getRandomInt } from './mock-utils';
import { POINT_TYPES, OFFERS } from '../const';

const offerID = getID();

const createOffer = () => ({
  id: offerID(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInt(300)
});

const offers = POINT_TYPES.map((pointType) => ({
  type: pointType,
  offers: Array.from({ length: getRandomInt(5)}, createOffer),
})
);

const getMockedOffers = () => offers;
const getRandomOffer = () => getRandomArrayElement(offers);


export {getMockedOffers, getRandomOffer};

