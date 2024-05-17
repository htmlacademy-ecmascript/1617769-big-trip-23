import AbstractView from '../framework/view/abstract-view';


const createInfoTemplate = (tripPoints) => {
  const totalPrice = tripPoints.reduce((price, tripEvent) => price + tripEvent.price, 0);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
};

export default class InfoView extends AbstractView{
  #tripPoints = null;

  constructor(tripPoints) {
    super();
    this.#tripPoints = tripPoints;
  }

  get template() {
    return createInfoTemplate(this.#tripPoints);
  }
}

