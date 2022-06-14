import { generateFilmDescription } from '../mock/film-data.js';

export default class FilmsModel {
  #films = Array.from({ length: 23 }, generateFilmDescription);

  get films() {
    return this.#films;
  }
}
