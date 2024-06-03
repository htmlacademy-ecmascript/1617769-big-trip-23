import { getDateDiff } from './date';

const isEscapeKey = (evt) => evt.key === 'Escape';
const isEmpty = (list) => list.length === 0;
const getIsCheckedAttr = (isChecked) => isChecked ? 'checked' : '';
const getIsDisabledAttr = (isDisabled) => isDisabled ? 'disabled' : '';
const updateItem = (items, updatedItem) => items.map((item) => item.id === updatedItem.id ? updatedItem : item);
const sortByDay = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;
const sortByTime = (pointA, pointB) => getDateDiff(pointB) - getDateDiff(pointA);
const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;
const firstLetterUpperCase = (word) => {
  const [firstLetter,...rest] = word;
  return `${firstLetter.toUpperCase()}${rest.join('')}`;
};
const addComponent = (components, component) => Array.from(new Set([...components, component]));
const removeComponent = (components, component) => components.filter((comp) => comp !== component);

const getInteger = (str) => {
  const num = parseInt(str.replace(/\D/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

export {
  isEscapeKey,
  firstLetterUpperCase,
  isEmpty,
  getIsCheckedAttr,
  getIsDisabledAttr,
  updateItem,
  sortByDay,
  sortByTime,
  sortByPrice,
  addComponent,
  removeComponent,
  getInteger
};
