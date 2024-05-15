import {filter} from '../utils/filter.js';

function generateFilter(tripPoints) {
  return Object.entries(filter).map(
    ([filterType, filterPoint]) => ({
      type: filterType,
      count: filterPoint(tripPoints).length,
    }),
  );
}

export {generateFilter};
