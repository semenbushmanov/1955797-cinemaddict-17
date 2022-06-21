import { render, remove, replace } from '../framework/render.js';
import { isEscKey } from '../utils/film.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import { CommentsModel } from '../model/comments-model.js';
import { UserAction, UpdateType, Mode } from '../const.js';

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
  #filmApiService = null;
  #uiBlocker = null;

  constructor(filmsContainer, changeData, changeMode, filmApiService, uiBlocker) {
    this.#filmsContainerComponent = filmsContainer.element;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#filmApiService = filmApiService;
    this.#uiBlocker = uiBlocker;

    this.#commentsModel = new CommentsModel(this.#filmApiService);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = (film) => {
    this.#film = film;
    this.#commentsModel.init(film);

    this.renderComponents();
  };

  renderComponents = () => {
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

  setSubmitting = () => {
    this.#popupComponent.updateElement({
      isDisabled: true,
    });
    this.#popupComponent.element.scroll(0, this.#popupScroll);
  };

  setDeleting = (commentId) => {
    this.#popupComponent.updateElement({
      isDisabled: true,
      commentBeingDeleted: commentId,
    });
    this.#popupComponent.element.scroll(0, this.#popupScroll);
  };

  setAborting = (actionType) => {
    const resetState = () => {
      this.#popupComponent.updateElement({
        isDisabled: false,
        commentBeingDeleted: null,
      });
      this.#popupComponent.element.scroll(0, this.#popupScroll);
    };

    const controlButtonsClass = '.film-details__controls';
    const newCommentClass = '.film-details__new-comment';
    const commentsListClass = '.film-details__comments-list';

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#mode === Mode.DEFAULT) {
          this.#filmCardComponent.shake();
          return;
        }

        this.#popupComponent.shake(resetState, controlButtonsClass);
        break;
      case UserAction.ADD_COMMENT:
        this.#popupComponent.shake(resetState, newCommentClass);
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupComponent.shake(resetState, commentsListClass);
        break;
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
    this.renderComponents();
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
      {...this.#film, userDetails: {...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist},
      },
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleHistoryClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched},
      },
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleFavoritesClick = () => {
    this.#popupScroll = this.#popupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite},
      },
      this.#mode,
      this.#popupScroll,
    );
  };

  #handleCommentsModelEvent = (update) => {
    switch (update) {
      case UpdateType.INIT:
        this.renderComponents();
        break;
      default:
        this.#changeData(
          update,
          UpdateType.PATCH,
          this.#film,
          this.#mode,
          this.#popupScroll,
        );
    }
  };

  #handleCommentDelete = async (commentId, scroll) => {
    this.#popupScroll = scroll;
    this.setDeleting(commentId);
    this.#uiBlocker.block();

    try {
      await this.#commentsModel.deleteComment(commentId);
    } catch(err) {
      this.setAborting(UserAction.DELETE_COMMENT);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentSubmit = async (localComment, scroll) => {
    this.#popupScroll = scroll;
    this.setSubmitting();
    this.#uiBlocker.block();

    try {
      await this.#commentsModel.addComment(localComment, this.#film);
    } catch(err) {
      this.setAborting(UserAction.ADD_COMMENT);
    }

    this.#uiBlocker.unblock();
  };
}
