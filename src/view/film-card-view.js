import AbstractView from '../framework/view/abstract-view.js';
import { getYearFromDate } from '../utils/film.js';
import { getDurationInHours } from '../utils/film.js';
import { getDurationInMins } from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  const { comments, filmInfo, userDetails } = film;
  const { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  const releaseDate = getYearFromDate(release.date);
  const hours = getDurationInHours(runtime);
  const mins = getDurationInMins(runtime);
  const shortDescription = description.length > 140 ? `${description.substring(0, 139)}...`: description;

  const watchlistClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const alreadyWatchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseDate}</span>
          <span class="film-card__duration">${hours}h ${mins}m</span>
          <span class="film-card__genre">${genre.join(' ')}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${shortDescription}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this._cardControls = this.element.querySelector('.film-card__controls');
    this.element.addEventListener('click', this.#handleClick);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#handleWatchlistClick);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#handleHistoryClick);
  };

  setFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#handleFavoritesClick);
  };

  #handleClick = (evt) => {
    evt.preventDefault();
    if (!this._cardControls.contains(evt.target)) {
      this._callback.click();
    }
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
}
