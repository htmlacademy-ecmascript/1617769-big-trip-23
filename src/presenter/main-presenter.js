import { isEmpty } from '../view/utils/common.js';
import DestinationPointsView from '../view/destination-points-view.js';
import DestinationEmptyView from '../view/destination-empty-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { UserAction, UpdateType, SortTypes } from '../const.js';

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
    this.#renderTripPoints();
  }

  get tripPoints() {
    return this.#model.tripPoints;
  }

  #renderSortView() {
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

  #clearTripPoints({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    if (this.#sortView) {
      this.#sortView.destroy();
    }
    if (this.#destinationEmptyView) {
      this.#destinationEmptyView.destroy();
    }
    if (resetSortType) {
      this.#model.currentSort = SortTypes.DAY;
    }
  }

  #onDestinationPointModeChange = () => this.#pointPresenters.forEach((presenter) => presenter.reset());

  #onSortTypeChange = (sortType) => {
    this.#model.currentSort = sortType;
    this.#onModelChange(UpdateType.MINOR);
  };

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
        this.#clearTripPoints({resetSortType: true});
        this.#renderTripPoints();
        break;
    }
  };
}
