import { getRandomArrayElement, getID, getRandomInt } from '../utils';
import { POINT_TYPES, OFFERS } from '../consts';

const offerID = getID();

const createOffer = () => ({
  id: offerID(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInt(1000)
});

const offers = POINT_TYPES.map((pointType) => ({
  type: pointType,
  offers: Array.from({ length: getRandomInt(5)}, createOffer),
})
);

const getMockedOffers = () => offers;
const getRandomOffer = () => getRandomArrayElement(offers);


export {getMockedOffers, getRandomOffer};

