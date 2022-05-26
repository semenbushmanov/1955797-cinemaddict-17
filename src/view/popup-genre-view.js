import AbstractView from '../framework/view/abstract-view.js';

const createPopupGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

export default class PopupGenreView extends AbstractView {
  #genre = null;

  constructor(genre) {
    super();
    this.#genre = genre;
  }

  get template() {
    return createPopupGenreTemplate(this.#genre);
  }
}
