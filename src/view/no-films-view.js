import { createElement } from '../render.js';

const createNoFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
        <p>There are no movies in our database</p>
    </section>
  </section>`
);

export default class NoFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoFilmsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
