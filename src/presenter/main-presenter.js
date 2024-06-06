import { isEmpty } from '../view/utils/common.js';
import DestinationPointsView from '../view/destination-points-view.js';
import DestinationEmptyView from '../view/destination-empty-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class MainPresenter {
  #model = null;
  #container = null;
  #destinationPointsView = null;
  #sortView = null;
  #destinationEmptyView = null;
  #pointPresenters = new Map();

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#model.addObserver(this.#onModelChange);
    this.#onModelChange(UpdateType.MAJOR);
  }

  get tripPoints() {
    return this.#model.tripPoints;
  }

  #renderSortView() {
    if (this.#sortView) {
      return;
    }

    this.#sortView = new SortView({
      currentSort: this.#model.currentSort,
      container: this.#container,
      onSortTypeChange: this.#onSortTypeChange,
    });
  }

  #renderDestinationEmptyView() {
    this.#destinationEmptyView = new DestinationEmptyView({ filter: this.#model.currentFilter, container: this.#container });
  }

  #renderDestinationPointsView(tripPoints) {
    if (!this.#destinationPointsView) {
      this.#destinationPointsView = new DestinationPointsView({ container: this.#container });
    }
    tripPoints.forEach((tripPoint) => {
      const pointPresenter = new PointPresenter({
        model: this.#model,
        container: this.#destinationPointsView.element,
        onTripEventChange: this.#onDestinationPointChange,
        onModeChange: this.#onDestinationPointModeChange,
      });
      pointPresenter.init(tripPoint);
      this.#pointPresenters.set(tripPoint.id, pointPresenter);
    });
  }

  #renderTripPoints() {
    const tripPoints = this.tripPoints;
    if (isEmpty(tripPoints)){
      this.#renderDestinationEmptyView();
      return;
    }

    this.#renderSortView();
    this.#renderDestinationPointsView(tripPoints);
  }

  #clearTripPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    if (this.#destinationEmptyView) {
      this.#destinationEmptyView.destroy();
    }
  }

  #onDestinationPointModeChange = () => this.#pointPresenters.forEach((presenter) => presenter.reset());

  #onSortTypeChange = (newSort) =>
    this.#onDestinationPointChange(
      UserAction.SORT,
      UpdateType.MINOR,
      newSort
    );


  #onDestinationPointChange = (actionType, updateType, data) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#model.updateTripEvent(updateType, data);
        break;
      case UserAction.ADD:
        this.#model.addTripEvent(updateType, data);
        break;
      case UserAction.DELETE:
        this.#model.deleteTripEvent(updateType, data);
        break;
      case UserAction.SORT:
        this.#model.setCurrentSort(updateType, data);
        break;
    }
  };

  #onModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripPoints();
        this.#renderTripPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearTripPoints();
        this.#renderTripPoints();
        break;
    }
  };
}
