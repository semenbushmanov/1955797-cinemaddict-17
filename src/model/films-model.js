import { generateFilmDescription } from '../mock/film-data.js';
import { generateComment } from '../mock/film-data.js';


export default class FilmsModel {
  #films = Array.from({ length: 23 }, generateFilmDescription);

  get films() {
    return this.#films;
  }
}

export class CommentsModel {
  #comments = Array.from({ length: 4 }, generateComment);

  get comments() {
    return this.#comments;
  }
}
