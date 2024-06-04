import { SortTypes } from '../../const';
import { getDateDiff } from './date';

const SortedTypes = {
  [SortTypes.DAY]: (pointA, pointB) => pointA.dateFrom - pointB.dateFrom,
  [SortTypes.TIME]: (pointA, pointB) => getDateDiff(pointB) - getDateDiff(pointA),
  [SortTypes.PRICE]: (pointA, pointB) => pointB.Price - pointA.Price,
};

export { SortedTypes };
