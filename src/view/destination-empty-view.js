import AbstractView from '../framework/view/abstract-view';
import { render, remove } from '../framework/render';
import { DestinationEmptyMassages } from './utils/filter';

const createEmptyTemplate = (filters) => `
  <p class="trip-events__msg">${DestinationEmptyMassages[filters]}</p>`;

export default class DestinationEmptyView extends AbstractView {
  #filter = '';

  constructor({filter, container}) {
    super();
    this.#filter = filter;
    render(this, container);
  }

  get template() {
    return createEmptyTemplate(this.#filter);
  }

  destroy() {
    remove(this);
  }
}
