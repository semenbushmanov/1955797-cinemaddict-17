import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (filters) => {
  const watchlistCount = filters.find((element) => element.name ==='watchlist').count;
  const historyCount = filters.find((element) => element.name ==='history').count;
  const favoritesCount = filters.find((element) => element.name ==='favorites').count;

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </nav>`
  );
};

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
