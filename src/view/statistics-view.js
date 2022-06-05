import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (filters) => `<p>${filters.all.count} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createStatisticsTemplate(this.#filters);
  }
}
