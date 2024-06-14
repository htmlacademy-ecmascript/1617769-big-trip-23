import { isEmpty } from '../utils/common';
import SortView from '../view/sort-view';
import TripView from '../view/trip-view';
import EmptyView from '../view/empty-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import { UserAction, UpdateType, DEFAULT_SORT_TYPE, DEFAULT_FILTER } from '../const/common';

export default class TripPresenter {
  #model = null;
  #container = null;
  #tripView = null;
  #sortView = null;
  #emptyView = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #addButton = null;

  constructor({ container, model, addButton }) {
    this.#container = container;
    this.#model = model;
    this.#model.addObserver(this.#onModelChange);
    this.#addButton = addButton;
    this.#addButton.addEventListener('click', this.#onAddButtonClick);

    this.#tripView = new TripView({ container: this.#container });
    this.#newPointPresenter = new NewPointPresenter({
      model,
      container: this.#tripView.element,
      onDataChange: this.#onPointChange,
      onDestroy: this.#onNewPointClose
    });

    this.#renderTrip();
  }

  get trip() {
    return this.#model.trip;
  }

  #renderEmptyView() {
    this.#emptyView = new EmptyView({ filter: this.#model.currentFilter, container: this.#container });
  }

  #renderSortView() {
    this.#sortView = new SortView({
      currentSort: this.#model.currentSort,
      container: this.#container,
      onSortTypeChange: this.#onSortTypeChange,
    });
  }

  #renderTripView(trip) {
    trip.forEach((point) => {
      const pointPresenter = new PointPresenter({
        model: this.#model,
        container: this.#tripView.element,
        onPointChange: this.#onPointChange,
        onModeChange: this.#onPointModeChange,
      });
      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #renderTrip() {
    const trip = this.trip;
    if (isEmpty(trip)) {
      this.#renderEmptyView();
      return;
    }

    this.#renderSortView();
    this.#renderTripView(trip);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    if (this.#sortView) {
      this.#sortView.destroy();
    }
    if (this.#emptyView) {
      this.#emptyView.destroy();
    }
    if (resetSortType) {
      this.#model.currentSort = DEFAULT_SORT_TYPE;
    }
  }

  #setAddButtonDisabled = (disabled) => (this.#addButton.disabled = disabled);

  #onPointModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortTypeChange = (sortType) => {
    this.#model.currentSort = sortType;
    this.#onModelChange(UpdateType.MINOR);
  };

  #onAddButtonClick = () => {
    this.#onPointModeChange();
    this.#model.currentSort = DEFAULT_SORT_TYPE;
    this.#model.setCurrentFilter(UpdateType.MAJOR, DEFAULT_FILTER);
    this.#newPointPresenter.init(this.#model);
    this.#setAddButtonDisabled(true);
  };

  #onNewPointClose = () => this.#setAddButtonDisabled(false);

  #onPointChange = (actionType, updateType, data) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#model.updatePoint(updateType, data);
        break;
      case UserAction.ADD:
        this.#model.addPoint(updateType, data);
        break;
      case UserAction.DELETE:
        this.#model.deletePoint(updateType, data);
        break;
    }
  };

  #onModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#onPointModeChange();
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };
}
