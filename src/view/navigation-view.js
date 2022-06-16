import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createNavigationTemplate = (filters, currentFilter) => (
  `<nav class="main-navigation">
    <a href="#all" data-filter-name="${FilterType.ALL}" class="main-navigation__item ${FilterType.ALL === currentFilter ? 'main-navigation__item--active' : ''}">${filters.all.name}</a>
    <a href="#watchlist" data-filter-name="${FilterType.WATCHLIST}" class="main-navigation__item ${FilterType.WATCHLIST === currentFilter ? 'main-navigation__item--active' : ''}">${filters.watchlist.name}<span class="main-navigation__item-count" data-filter-name="${FilterType.WATCHLIST}">${filters.watchlist.count}</span></a>
    <a href="#history" data-filter-name="${FilterType.HISTORY}" class="main-navigation__item ${FilterType.HISTORY === currentFilter ? 'main-navigation__item--active' : ''}">${filters.history.name}<span class="main-navigation__item-count" data-filter-name="${FilterType.HISTORY}">${filters.history.count}</span></a>
    <a href="#favorites" data-filter-name="${FilterType.FAVORITES}" class="main-navigation__item ${FilterType.FAVORITES === currentFilter ? 'main-navigation__item--active' : ''}">${filters.favorites.name}<span class="main-navigation__item-count" data-filter-name="${FilterType.HISTORY}">${filters.favorites.count}</span></a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.addEventListener('click', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
      evt.preventDefault();
      this._callback.filterChange(evt.target.dataset.filterName);
    }
  };
}
