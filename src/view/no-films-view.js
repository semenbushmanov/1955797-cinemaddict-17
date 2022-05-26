import AbstractView from '../framework/view/abstract-view.js';

const createNoFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
        <p>There are no movies in our database</p>
    </section>
  </section>`
);

export default class NoFilmsView extends AbstractView {
  get template() {
    return createNoFilmsTemplate();
  }
}
