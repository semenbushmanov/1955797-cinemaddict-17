import AbstractView from '../framework/view/abstract-view.js';

const createSectionFilmsTemplate = () => ('<section class="films"></section>');

export default class SectionFilmsView extends AbstractView {
  get template() {
    return createSectionFilmsTemplate();
  }
}
