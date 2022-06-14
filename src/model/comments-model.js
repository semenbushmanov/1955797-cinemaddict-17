import { generateComment } from '../mock/film-data.js';

export class CommentsModel {
  #comments = Array.from({ length: 4 }, generateComment);

  get comments() {
    return this.#comments;
  }
}
