import FilterPresenter from './presenter/filter-presenter';
import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';


const run = () => {
  const pointsElement = document.querySelector('.trip-events');
  const filtersElement = document.querySelector('.trip-controls__filters');
  // const headerMainElement = document.querySelector('.trip-main');

  const pointModel = new PointModel();
  pointModel.init();

  new FilterPresenter({ container: filtersElement, model: pointModel });
  new MainPresenter({ container: pointsElement, model: pointModel });
};

run();
