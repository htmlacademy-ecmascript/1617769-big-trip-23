import AbstractView from '../framework/view/abstract-view';
import { DestinationEmptyMassages } from '../const';

const createEmptyTemplate = (filters) => `
  <p class="trip-events__msg">${DestinationEmptyMassages[filters]}</p>`;

export default class DestinationEmptyView extends AbstractView {
  #filter = '';

  constructor({filter}) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createEmptyTemplate(this.#filter);
  }
}
