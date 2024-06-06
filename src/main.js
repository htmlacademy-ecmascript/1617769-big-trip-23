import HeaderPresenter from './presenter/header-presenter';
import MainPresenter from './presenter/main-presenter';
import PointModel from './model/point-model';


const run = () => {

  const pointsElement = document.querySelector('.trip-events');
  const filtersElement = document.querySelector('.trip-controls__filters');
  const headerMainElement = document.querySelector('.trip-main');

  const pointModel = new PointModel();
  pointModel.init();

  new HeaderPresenter(
    {
      container: {
        filter: filtersElement,
        info: headerMainElement
      },
      model: pointModel
    }
  );

  new MainPresenter(
    {
      container: pointsElement,
      model: pointModel
    }
  );
};

run();
