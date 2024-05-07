import { render } from '../render.js';
import FormEditView from '../view/form-edit-view.js';
import DestinationPointView from '../view/destination-point-view.js';
import DestinationPointsView from '../view/destination-points-view.js';
import SortView from '../view/sort-view';


export default class MainPresenter {
  constructor({container, model}) {
    this.container = container;
    this.model = model;
  }

  init() {
    this.tripPoints = [...this.model.getTripPoints()];

    render(new SortView(), this.container);

    const tripPointList = new DestinationPointsView();
    render(tripPointList, this.container);
    render(new FormEditView(this.tripPoints[0]), tripPointList.getElement()); // импортировать BLANK_TRIP_POINT

    this.tripPoints.forEach((tripPoint) => render(new DestinationPointView(tripPoint), tripPointList.getElement())); // сменить на for
  }
}