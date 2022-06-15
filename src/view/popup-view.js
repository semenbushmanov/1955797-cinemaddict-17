import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmReleaseDate } from '../utils/film.js';
import { getDuration } from '../utils/film.js';
import { humanizeCommentDate } from '../utils/film.js';
import { isCtrlEnterKey } from '../utils/common.js';


const createPopupTemplate = (film, commentaries) => {
  const { comments, filmInfo, userDetails } = film;
  const { title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release, runtime, genre,description } = filmInfo;
  const releaseDate = humanizeFilmReleaseDate(release.date);
  const duration = getDuration(runtime);

  const createGenreTemplate = (filmGenre) => `<span class="film-details__genre">${filmGenre}</span>`;

  const createCommentTemplate = (commentary) => {
    const { id, author, comment, date, emotion } = commentary;
    const commentDate = humanizeCommentDate(date);

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete" data-id="${id}">Delete</button>
          </p>
        </div>
      </li>`
    );
  };

  const genresTemplate = genre.map(createGenreTemplate).join('');
  const commentsTemplate = commentaries.map(createCommentTemplate).join('');


  const watchlistClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const alreadyWatchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">
    
              <p class="film-details__age">${ageRating}+</p>
            </div>
    
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>
    
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>
    
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell" id="genre-cell">${genresTemplate}</td>
                </tr>
              </table>
    
              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
    
          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
    
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    
            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>
    
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${film.emoji !== null ? `<img src="images/emoji/${film.emoji}.png" width="55" height="55" alt="emoji-${film.emoji}">`: ''}                
              </div>
    
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${film.inputDescription}</textarea>
              </label>
    
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${film.emoji === 'smile'? 'checked': ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${film.emoji === 'sleeping'? 'checked': ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${film.emoji === 'puke'? 'checked': ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${film.emoji === 'angry'? 'checked': ''}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class PopupView extends AbstractStatefulView {
  #comments = null;
  #popupScroll = 0;

  constructor(film, comments) {
    super();
    this._state = PopupView.convertFilmToState(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state, this.#comments);
  }

  static convertFilmToState = (film) => ({...film,
    emoji: null,
    inputDescription: ''
  });

  static convertStateToFilm = (state) => {
    const film = {...state};

    delete film.emoji;
    delete film.inputDescription;

    return film;
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#handleClick);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#handleWatchlistClick);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#handleHistoryClick);
  };

  setFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#handleFavoritesClick);
  };

  setDeleteClickHandlers = (callback) => {
    this._callback.deleteClick = callback;
    const deleteLinks = this.element.querySelectorAll('.film-details__comment-delete');
    deleteLinks.forEach((link) => link.addEventListener('click', this.#handleDeleteClick));
  };

  setCommentSubmitHandler = (callback) => {
    this._callback.commentSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#handleCommentSubmit);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.setDeleteClickHandlers(this._callback.deleteClick);
    this.setCommentSubmitHandler(this._callback.commentSubmit);
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((input) => {
      input.addEventListener('change', this.#handleEmojiChange);
    });
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#handleInputDescription);
  };

  #handleEmojiChange = (evt) => {
    this.#popupScroll = this.element.scrollTop;
    evt.preventDefault();
    this.updateElement({
      emoji: evt.target.value
    });
    this.element.scroll(0, this.#popupScroll);
  };

  #handleInputDescription = (evt) => {
    evt.preventDefault();
    this._setState({
      inputDescription: evt.target.value
    });
  };

  #handleClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #handleWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #handleHistoryClick = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #handleFavoritesClick = (evt) => {
    evt.preventDefault();
    this._callback.favoritesClick();
  };

  #handleDeleteClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(evt.target.dataset.id, this.#popupScroll);
  };

  #handleCommentSubmit = (evt) => {
    if (isCtrlEnterKey(evt) && Boolean(this._state.emoji) && Boolean(this._state.inputDescription)) {
      evt.preventDefault();
      this._callback.commentSubmit({
        comment: this._state.inputDescription,
        emotion: this._state.emoji
      },
      this.#popupScroll,
      );
    }
  };
}
