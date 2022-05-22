import { createElement } from '../render.js';

const createPopupGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

export default class PopupGenreView {
  #element = null;
  #genre = null;

  constructor(genre) {
    this.#genre = genre;
  }

  get template() {
    return createPopupGenreTemplate(this.#genre);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
