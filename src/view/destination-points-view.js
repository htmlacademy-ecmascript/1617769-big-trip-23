import AbstractView from '../framework/view/abstract-view';
import { render } from '../framework/render';

const createTripPointListTemplate = () => `
  <ul class="trip-events__list">
  </ul>`;

export default class DestinationPointsView extends AbstractView {
  constructor ({ container }) {
    super();
    render(this, container);
  }

  get template() {
    return createTripPointListTemplate();
  }
}
