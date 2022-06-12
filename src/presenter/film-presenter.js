import { render, remove, replace } from '../framework/render.js';
import { isEscKey } from '../utils/common.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmCardComponent = null;
  #popupComponent = null;
  #filmsContainerComponent = null;
  #film = null;
  #comments = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #popupScroll = 0;

  constructor(filmsContainer, changeData, changeMode) {
    this.#filmsContainerComponent = filmsContainer.element;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const previousFilmCardComponent = this.#filmCardComponent;
    const previousPopupComponent = this.#popupComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#popupComponent = new PopupView(this.#film, this.#comments);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardClick);

    this.#popupComponent.setClickHandler(this.#handlePopupCloseButtonClick);

    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmCardComponent.setFavoritesClickHandler(this.#handleFavoritesClick);

    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#popupComponent.setFavoritesClickHandler(this.#handleFavoritesClick);

    if (previousFilmCardComponent === null || previousPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsContainerComponent);
      return;
    }

    replace(this.#filmCardComponent, previousFilmCardComponent);
    replace(this.#popupComponent, previousPopupComponent);

    if (this.#mode === Mode.POPUP) {
      this.#openPopup();
    }

    remove(previousFilmCardComponent);
    remove(previousPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  #openPopup = () => {
    render(this.#popupComponent, document.body);
    this.#popupComponent.element.scroll(0, this.#popupScroll);
    document.body.classList.add('hide-overflow');
    this.#mode = Mode.POPUP;
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
    this.#popupScroll = 0;
    this.#changeData(this.#film); // restore popupComponent with all handlers after complete removal by command "remove(this.#popupComponent)" for future use.
  };

  #handleEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#handleEscKeyDown);
    }
  };

  #handleFilmCardClick = () => {
    this.#changeMode();
    this.#openPopup();
    document.addEventListener('keydown', this.#handleEscKeyDown);
  };

  #handlePopupCloseButtonClick = () => {
    this.#closePopup();
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleWatchlistClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };

  #handleHistoryClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleFavoritesClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };
}
