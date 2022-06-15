import Observable from '../framework/observable.js';
import { generateComment } from '../mock/film-data.js';

export class CommentsModel extends Observable {
  #comments = Array.from({ length: 4 }, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, comment) => {
    this.#comments = [
      comment,
      ...this.#comments,
    ];

    this._notify(updateType);
  };

  deleteComment = (updateType, commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments.splice(index, 1);

    this._notify(updateType);
  };
}
