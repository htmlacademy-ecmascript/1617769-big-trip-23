import { render, RenderPosition } from '../render.js';
import FormEditView from '../view/form-edit-view.js';
import DestinationPointView from '../view/destination-point-view.js';
import FilterView from '../view/filter-view';
import TripMainView from '../view/trip-main-view';
import SortView from '../view/sort-view';


export default class Presenter {
  constructor() {
    // Поиск элементов в DOM,которые будут использоваться для рендеринга компонентов
    this.pageHeader = document.querySelector('.page-header');
    this.tripMain = this.pageHeader.querySelector('.trip-main'); // trip-main-view
    this.tripControlsFilters = this.pageHeader.querySelector('.trip-controls__filters'); // filter-view
    this.pageMain = document.querySelector('.page-main');
    this.tripEvents = this.pageMain.querySelector('.trip-events'); // sort-view

    // Создание списка для точек путешествия и доб его в эл-т trip-events
    this.destinationPointList = document.createElement('ul');
    this.destinationPointList.classList.add('trip-events__list');
    this.tripEvents.appendChild(this.destinationPointList);
  }

  // Рендеринг основного представления

  renderTripMain() {
    render(new TripMainView(), this.tripMain, RenderPosition.AFTERBEGIN);
  }

  // Рендеринг фильтров

  renderFilter() {
    render(new FilterView(), this.tripControlsFilters);
  }

  // Рендеринг сортировки

  renderSort() {
    render(new SortView(), this.tripEvents, RenderPosition.AFTERBEGIN);
  }

  // Рендеринг трёх точек путешествия

  renderDestinationPoint() {
    for (let i = 0; i < 3; i++) {
      render(new DestinationPointView(), this.destinationPointList);
    }
  }

  // Рендеринг формы редактирования точки путешествия

  renderFormEdit() {
    render(new FormEditView(), this.destinationPointList, RenderPosition.AFTERBEGIN);
  }

  init() {
    this.renderTripMain();
    this.renderFilter();
    this.renderSort();
    this.renderDestinationPoint();
    this.renderFormEdit();
  }
}
