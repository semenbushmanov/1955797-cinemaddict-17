import AbstractView from '../framework/view/abstract-view.js';
import { getYearFromDate } from '../utils/film.js';
import { getDurationInHours } from '../utils/film.js';
import { getDurationInMins } from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  const { comments, filmInfo} = film;
  const { title, totalRating, poster, release, runtime, genre, description } = filmInfo;
  const releaseDate = getYearFromDate(release.date);
  const hours = getDurationInHours(runtime);
  const mins = getDurationInMins(runtime);
  const shortDescription = description.length > 140 ? `${description.substring(0, 139)}...`: description;

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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
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
    this.element.addEventListener('click', this.#handleClick);
  };

  #handleClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
