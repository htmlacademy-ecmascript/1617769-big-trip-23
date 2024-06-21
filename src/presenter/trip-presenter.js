import { isEmpty } from '../utils/common';
import SortView from '../view/sort-view';
import TripView from '../view/trip-view';
import LoadingView from '../view/loading-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import { UserAction, UpdateType, Message, DEFAULT_SORT_TYPE, DEFAULT_FILTER,
  TripEmptyMessage, UiBlockerConfig } from '../const/common';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { getFiltered } from '../utils/filter';
import { getSorted } from '../utils/sort';

export default class TripPresenter {
  #model = null;
  #container = null;
  #tripView = null;
  #sortView = null;
  #loadingView = null;
  #isLoading = true;
  #isError = false;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #addButton = null;
  #uiBlocker = new UiBlocker(UiBlockerConfig);

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
    const filteredTrip = getFiltered(this.#model.trip, this.#model.currentFilter);
    return getSorted(filteredTrip, this.#model.currentSort);
  }

  #renderLoadingView = (message) => {
    this.#loadingView = new LoadingView ({ message, container: this.#container });
  };

  #clearLoadingView = () => {
    if (this.#loadingView) {
      this.#loadingView.destroy();
    }
  };

  #renderSortView = () => {
    this.#sortView = new SortView({
      currentSort: this.#model.currentSort,
      container: this.#container,
      onSortTypeChange: this.#onSortTypeChange,
    });
  };

  #renderTripView = (trip) => {
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
  };

  #getLoading = () => {
    if (this.#isLoading) {
      return Message.LOADING;
    }

    if (this.#isError) {
      return Message.ERROR;
    }

    if (isEmpty(this.trip)) {
      return TripEmptyMessage[this.#model.currentFilter];
    }
    return '';
  };

  #renderTrip = () => {
    const message = this.#getLoading();
    if (message) {
      this.#setAddButtonDisabled(this.#isLoading);
      this.#renderLoadingView(message);
      return;
    }

    this.#renderSortView();
    this.#renderTripView(this.trip);
  };

  #clearTrip = (resetSortType = false) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    if (this.#sortView) {
      this.#sortView.destroy();
    }
    this.#clearLoadingView();
    if (resetSortType) {
      this.#model.currentSort = DEFAULT_SORT_TYPE;
    }
  };

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
    this.#clearTrip();
    this.#model.currentSort = DEFAULT_SORT_TYPE;
    this.#model.setCurrentFilter(UpdateType.MAJOR, DEFAULT_FILTER);
    this.#newPointPresenter.init(this.#model);
    this.#setAddButtonDisabled(true);
  };

  #onNewPointClose = () => this.#setAddButtonDisabled(false);

  #onPointChange = async (actionType, updateType, data) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD:
        this.#newPointPresenter.setSaving();
        try {
          await this.#model.addPoint(updateType, data);
        } catch(error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE:
        this.#pointPresenters.get(data.id).setSaving();
        try {
          await this.#model.updatePoint(updateType, data);
        } catch(error) {
          this.#pointPresenters.get(data.id).setAborting();
        }
        break;
      case UserAction.DELETE:
        this.#pointPresenters.get(data.id).setDeleting();
        try {
          await this.#model.deletePoint(updateType, data);
        } catch(error) {
          this.#pointPresenters.get(data.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #onModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#onPointModeChange();
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip(true);
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#setAddButtonDisabled(this.#isLoading);
        this.#loadingView.destroy();
        this.#renderTrip();
        break;
      case UpdateType.ERROR:
        this.#isError = true;
        this.#renderTrip();
        break;
    }
  };
}
