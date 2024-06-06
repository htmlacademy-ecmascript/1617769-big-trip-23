import InfoView from '../view/info-view';

export default class InfoPresenter {
  #model = null;
  #container = null;
  #infoContainer = null;
  #filterView = null;

  constructor ({ container, model }) {
    this.#container = container;
    this.#model = model;

    this.init();
    this.#model.addObserver(this.#onModelChange);
  }

  init() {
    this.#renderSum(this.#model);
  }

  #renderSum({ tripInfo }) {
    new InfoView({ tripInfo, container: this.#infoContainer });
  }

  #onModelChange = () => this.init();
}
