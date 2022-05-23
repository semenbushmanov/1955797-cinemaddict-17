import { render } from '../render.js';
import { isEscKey } from '../util.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupGenreView from '../view/popup-genre-view.js';

const FILM_COUNT_PER_STEP = 5;

export default class ContentPresenter {
  #contentContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmsListComponent = new FilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init = (contentContainer, filmsModel, commentsModel) => {
    this.#contentContainer = contentContainer;
    this.#filmsModel = filmsModel;
    this.#filmCards = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    render(new SortView(),this.#contentContainer);
    render(this.#filmsListComponent, this.#contentContainer);
    render(this.#filmsContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#filmCards.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    if (this.#filmCards.length > FILM_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

      this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick);
    }
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#filmCards.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#filmCards.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);
    const popupComponent = new PopupView(film);
    const commentList = popupComponent.element.querySelector('.film-details__comments-list');
    const genres = film.filmInfo.genre;
    const genreCell = popupComponent.element.querySelector('#genre-cell');

    for (let i =0; i < this.#comments.length; i++) {
      render(new PopupCommentView(this.#comments[i]), commentList);
    }

    for (let i =0; i < genres.length; i++) {
      render(new PopupGenreView(genres[i]), genreCell);
    }

    const openPopup = () => {
      document.body.appendChild(popupComponent.element);
      document.body.classList.add('hide-overflow');
    };

    const closePopup = () => {
      document.body.removeChild(popupComponent.element);
      document.body.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (isEscKey(evt)) {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmCardComponent.element.addEventListener('click', () => {
      openPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmCardComponent, this.#filmsContainerComponent.element);
  };
}
