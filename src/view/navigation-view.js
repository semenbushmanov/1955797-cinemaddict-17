import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (filters) => (
  `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">${filters.all.name}</a>
      <a href="#watchlist" class="main-navigation__item">${filters.watchlist.name}<span class="main-navigation__item-count">${filters.watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">${filters.history.name}<span class="main-navigation__item-count">${filters.history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">${filters.favorites.name}<span class="main-navigation__item-count">${filters.favorites.count}</span></a>
    </nav>`
);

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
