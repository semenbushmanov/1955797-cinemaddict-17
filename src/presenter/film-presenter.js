import { render, remove, replace } from '../framework/render.js';
import { isEscKey } from '../utils/common.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import { CommentsModel } from '../model/comments-model.js';
import { UserAction, UpdateType, Mode } from '../const.js';
import { nanoid } from 'nanoid';

export default class FilmPresenter {
  #filmCardComponent = null;
  #popupComponent = null;
  #filmsContainerComponent = null;
  #film = null;
  #changeData = null;
  #changeMode = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT;
  #popupScroll = 0;

  constructor(filmsContainer, changeData, changeMode) {
    this.#filmsContainerComponent = filmsContainer.element;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#commentsModel = new CommentsModel();
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = (film) => {
    this.#film = film;

    const previousFilmCardComponent = this.#filmCardComponent;
    const previousPopupComponent = this.#popupComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#popupComponent = new PopupView(this.#film, this.comments);

    this.#filmCardComponent.setClickHandler(this.#handleFilmCardClick);

    this.#popupComponent.setClickHandler(this.#handlePopupCloseButtonClick);

    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmCardComponent.setFavoritesClickHandler(this.#handleFavoritesClick);

    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#popupComponent.setFavoritesClickHandler(this.#handleFavoritesClick);
    this.#popupComponent.setDeleteClickHandlers(this.#handleCommentDelete);
    this.#popupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);

    if (previousFilmCardComponent === null || previousPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsContainerComponent);
      if (this.#mode === Mode.POPUP) {
        this.#openPopup();
      }
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

  setPopupOpen = () => {
    this.#mode = Mode.POPUP;
  };

  setPopupScroll = (scroll) => {
    this.#popupScroll = scroll;
  };

  destroy = () => {
    this.#closePopup();
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
    document.addEventListener('keydown', this.#handleEscKeyDown);
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
    this.#popupScroll = 0;
    this.init(this.#film); // restore popupComponent with all handlers after complete removal by command "remove(this.#popupComponent)" for future use.
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleFilmCardClick = () => {
    this.#changeMode();
    this.#openPopup();
  };

  #handlePopupCloseButtonClick = () => {
    this.#closePopup();
  };

  #handleWatchlistClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleHistoryClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleFavoritesClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleCommentsModelEvent = (updateType) => {
    this.#changeData(
      UserAction.UPDATE_COMMENT,
      updateType,
      this.#film,
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleCommentDelete = (commentId, scroll) => {
    this.#popupScroll = scroll;
    this.#commentsModel.deleteComment(UpdateType.PATCH, commentId);
  };

  #handleCommentSubmit = (localComment, scroll) => {
    const comment = {
      'id': nanoid(),
      'author': 'Leo Malcolm',
      'comment': localComment.comment,
      'date': new Date().toISOString(),
      'emotion': localComment.emotion
    };

    this.#popupScroll = scroll;
    this.#commentsModel.addComment(UpdateType.PATCH, comment);
  };
}
