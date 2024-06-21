import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { DateFormat } from '../const/common';

dayjs.extend(duration);

const getDateDiff = ({ dateFrom, dateTo }) => dayjs(dateTo).diff(dateFrom);

const displayDuration = (dateFrom, dateTo) => {
  const dateDelta = dayjs.duration(getDateDiff({ dateFrom, dateTo }));
  if (dateDelta.days()) {
    return dateDelta.format(DateFormat.DAY);
  }

  if (dateDelta.hours()) {
    return dateDelta.format(DateFormat.HOUR);
  }

  return dateDelta.format(DateFormat.MINUTE);
};

const isDatesEqual = (dateA, dateB) => ((dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D'));

const displayDateMonth = (date) => date ? dayjs(date).format(DateFormat.MONTH_DAY) : '';
const displayDate = (date) => date ? dayjs(date).format(DateFormat.DATE) : '';
const displayTime = (time) => time ? dayjs(time).format(DateFormat.TIME) : '';
const displayDateTime = (date, dateFormat = DateFormat.DATE_TIME_SYSTEM) => date ? dayjs(date).format(dateFormat) : '';

export { getDateDiff, isDatesEqual, displayDuration, displayDate, displayDateMonth, displayTime, displayDateTime };
