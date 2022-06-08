import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (sort) => {
  const defaultSortActive = sort === SortType.DEFAULT
    ? 'sort__button--active'
    : '';

  const dateSortActive = sort === SortType.DATE
    ? 'sort__button--active'
    : '';

  const ratingSortActive = sort === SortType.RATING
    ? 'sort__button--active'
    : '';

  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button ${defaultSortActive}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${dateSortActive}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${ratingSortActive}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortView extends AbstractView {
  #sort = null;

  constructor(sort) {
    super();
    this.#sort = sort;
  }

  get template() {
    return createSortTemplate(this.#sort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.handleSortTypeChange);
  };

  handleSortTypeChange = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
