import { getRandomArrayElement, getID, getRandomInt, getRandomBoolean,
  getDateWithRandomTime } from '../utils/common';
import { POINT_COUNT, POINT_TYPES } from '../const';
import { getRandomDestination } from './destination';


const pointID = getID();

const createMockPoint = () => {
  const { id: destinationId } = getRandomDestination();
  const dateStart = getDateWithRandomTime();
  const dateEnd = getDateWithRandomTime(dateStart);

  return {
    id: pointID(),
    type: getRandomArrayElement(POINT_TYPES),
    dateFrom: dateStart,
    dateTo: dateEnd,
    destination: destinationId,
    price: getRandomInt(1500),
    isFavorite: getRandomBoolean(),
  };
};

const getMockedPoints = () => Array.from({ length: POINT_COUNT}, createMockPoint);


export { getMockedPoints };


