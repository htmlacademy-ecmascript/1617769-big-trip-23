import dayjs from 'dayjs';
import {FilterType} from '../const';

const currentDate = dayjs();

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => [...tripPoints],
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => tripPoint.dateFrom > currentDate),
  [FilterType.PRESENT]: (tripPoints) => tripPoints.filter((tripPoint) => tripPoint.dateFrom >= currentDate && tripPoint.dateTo <= currentDate),
  [FilterType.PAST]: (tripPoints) => tripPoints.filter((tripPoint) => tripPoint.dateTo < currentDate),
};

export {filter};
