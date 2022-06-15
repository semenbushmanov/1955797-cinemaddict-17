import { render, remove } from '../framework/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, Mode } from '../const.js';
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
  #filterModel = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sectionFilmsComponent = new SectionFilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #noFilmsComponent = new NoFilmsView();

  #filmPresentersMap = new Map();

  #openPopupId = null;
  #popupScroll = null;

  constructor(contentContainer, filmsModel, filterModel) {
    this.#contentContainer = contentContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);
    this.#filterModel.addObserver(this.#handleFilmsModelEvent);
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderContent();
  };

  #handleViewAction = (actionType, updateType, update, popupMode, popupScroll) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (popupMode === Mode.POPUP) {
          this.#openPopupId = update.id;
          this.#popupScroll = popupScroll;
        }
        this.#filmsModel.updateFilm(updateType, update);
        this.#openPopupId = null;
        break;
      case UserAction.UPDATE_COMMENT:
        this.#popupScroll = popupScroll;
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleFilmsModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresentersMap.get(data.id).setPopupScroll(this.#popupScroll);
        this.#filmPresentersMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearContent();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#openPopupId = null;
        this.#clearContent({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderContent();
        break;
    }
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresentersMap.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearContent({resetRenderedFilmsCount: true});
    this.#renderContent();
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainerComponent, this.#handleViewAction, this.#handleModeChange);
    if (film.id === this.#openPopupId) {
      filmPresenter.setPopupOpen();
      filmPresenter.setPopupScroll(this.#popupScroll);
    }

    filmPresenter.init(film);
    this.#filmPresentersMap.set(film.id, filmPresenter);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent,this.#contentContainer);
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
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #clearContent = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmPresentersMap.forEach((presenter) => presenter.destroy());
    this.#filmPresentersMap.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmsComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filmsContainerComponent);
    remove(this.#filmsListComponent);
    remove(this.#sectionFilmsComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderContent =() => {
    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsListContainer();

    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));

    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };
}
