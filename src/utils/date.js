import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { DateFormats } from '../const/common';

dayjs.extend(duration);

const getDateDiff = ({ dateFrom, dateTo }) => dayjs(dateTo).diff(dateFrom);

const displayDuration = (dateFrom, dateTo) => {
  const dateDiff = dayjs.duration(getDateDiff({ dateFrom, dateTo }));

  if (dateDiff.days()) {
    const diffInDays = dayjs(dateTo).diff(dateFrom, 'day').toString().padStart(2, '0');
    return `${diffInDays}D ${dateDiff.format(DateFormats.HOUR)}`;
  }
  if (dateDiff.hours()) {
    return dateDiff.format(DateFormats.HOUR);
  }

  return dateDiff.format(DateFormats.MINUTE);
};


const displayDateMonth = (date) => date ? dayjs(date).format(DateFormats.MONTH_DAY) : '';
const displayDate = (date) => date ? dayjs(date).format(DateFormats.DATE) : '';
const displayTime = (time) => time ? dayjs(time).format(DateFormats.TIME) : '';
const displayDateTime = (date, dateFormat = DateFormats.DATE_TIME_SYSTEM) => date ? dayjs(date).format(dateFormat) : '';

export { getDateDiff, displayDuration, displayDate, displayDateMonth, displayTime, displayDateTime };
