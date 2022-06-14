import { render, remove, replace } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { SortType } from '../const.js';
import SortView from '../view/sort-view.js';
import SectionFilmsView from '../view/section-films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class ContentPresenter {
  #contentContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #sortComponent = null;

  #filmCards = [];
  #comments = [];
  #originalFilmCards = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sectionFilmsComponent = new SectionFilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsComponent = new NoFilmsView();

  #filmPresenter = new Map();

  constructor(contentContainer, filmsModel) {
    this.#contentContainer = contentContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmsModel.films];
    this.#originalFilmCards = [...this.#filmsModel.films];

    this.#renderContent();
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmCards = updateItem(this.#filmCards, updatedFilm);
    this.#originalFilmCards = updateItem(this.#originalFilmCards, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
    this.#renderSort();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#filmCards.sort(sortByRating);
        break;
      default:
        this.#filmCards = [...this.#originalFilmCards];
    }

    this.#currentSortType = sortType;
  };

  #renderFilms = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderSort = () => {
    const previousSortComponent = this.#sortComponent;

    if (previousSortComponent === null) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent,this.#contentContainer);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      return;
    }

    this.#sortComponent = new SortView(this.#currentSortType);
    replace(this.#sortComponent, previousSortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    remove(previousSortComponent);
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#contentContainer);
  };

  #renderFilmsListContainer = () => {
    render(this.#sectionFilmsComponent, this.#contentContainer);
    render(this.#filmsListComponent, this.#sectionFilmsComponent.element);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilmsList = () => {
    this.#renderFilms(0, Math.min(this.#filmCards.length, FILM_COUNT_PER_STEP));

    if (this.#filmCards.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderContent =() => {
    if (this.#filmCards.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderSort();
      this.#renderFilmsListContainer();
      this.#renderFilmsList();
    }
  };
}
