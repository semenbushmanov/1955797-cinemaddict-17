import { createElement } from '../render.js';

const createPopupGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

export default class PopupGenreView {
  constructor(genre) {
    this.genre = genre;
  }

  getTemplate() {
    return createPopupGenreTemplate(this.genre);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
