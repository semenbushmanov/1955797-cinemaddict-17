import { render, remove } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
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

  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #sortComponent = new SortView();
  #noFilmsComponent = new NoFilmsView();

  #filmCards = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #filmPresenter = new Map();

  constructor(contentContainer, filmsModel, commentsModel) {
    this.#contentContainer = contentContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];

    this.#renderContent();
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmCards = updateItem(this.#filmCards, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#comments);
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

  #renderFilms = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film, this.#comments);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderSort = () => {
    render(this.#sortComponent,this.#contentContainer);
  };

  #renderNoFilms = () => {
    render(this.#noFilmsComponent, this.#contentContainer);
  };

  #renderFilmsListContainer = () => {
    render(this.#filmsListComponent, this.#contentContainer);
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
