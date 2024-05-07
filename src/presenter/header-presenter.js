import { render } from '../render';
import FilterView from '../view/filter-view';
import InfoView from '../view/info-view';
import { RenderPosition } from '../render';

export default class HeaderPresenter {
  constructor ({ filterContainer, infoContainer }) {
    this.filterContainer = filterContainer;
    this.infoContainer = infoContainer;
  }

  init() {
    render(new FilterView(), this.filterContainer, RenderPosition.BEFOREEND);
    render(new InfoView(), this.infoContainer, RenderPosition.AFTERBEGIN);
  }
}
