import { createElement } from '../render.js';
import { getYearFromDate } from '../util.js';
import { getDurationInHours } from '../util.js';
import { getDurationInMins } from '../util.js';

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

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
