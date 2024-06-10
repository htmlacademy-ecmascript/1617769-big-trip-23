import FilterPresenter from './presenter/filter-presenter';
import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';
import InfoPresenter from './presenter/info-presenter';

const run = async () => {
  const pointsElement = document.querySelector('.trip-events');
  const filtersElement = document.querySelector('.trip-controls__filters');
  const headerMainElement = document.querySelector('.trip-main');
  const addButtonElement = document.querySelector('.trip-main__event-add-btn');

  const pointModel = new PointModel();

  await pointModel.init();
  console.log(pointModel.tripPoints);

  new InfoPresenter({ container: headerMainElement, model: pointModel });
  new FilterPresenter({ container: filtersElement, model: pointModel });
  new MainPresenter({ container: pointsElement, model: pointModel, addButton: addButtonElement });


};

run();
