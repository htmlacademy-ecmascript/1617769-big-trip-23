import { isEmpty } from '../view/utils/common.js';
import DestinationPointsView from '../view/destination-points-view.js';
import DestinationEmptyView from '../view/destination-empty-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class MainPresenter {
  #model = null;
  #container = null;
  #tripPoints = [];
  #destinationPointsView = null;
  #sortView = null;
  #destinationEmptyView = null;
  #pointPresenters = new Map();

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#model.addObserver(this.#onModelChange);
  }

  init() {
    this.#tripPoints = this.#model.tripPoints;
    this.#onModelChange(UpdateType.MAJOR);
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

  #renderDestinationPointsView() {
    if (!this.#destinationPointsView) {
      this.#destinationPointsView = new DestinationPointsView({ container: this.#container });
    }
    this.#tripPoints.forEach((tripPoint) => {
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
    if (isEmpty(this.#tripPoints)){
      this.#renderDestinationEmptyView();
      return;
    }

    this.#renderSortView();
    this.#renderDestinationPointsView();
  }

  #clearTripPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    if (this.#destinationEmptyView) {
      this.#destinationEmptyView.destroy();
    }
  }

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

  #onDestinationPointModeChange = () => this.#pointPresenters.forEach((presenter) => presenter.reset());

  #onSortTypeChange = (newSort) => {
    this.#model.currentSort = newSort;
    this.init();
  };
}
