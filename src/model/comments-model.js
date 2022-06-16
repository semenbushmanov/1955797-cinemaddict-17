import Observable from '../framework/observable.js';
import { CommentAction } from '../const.js';

export class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#filmsApiService.getComments(film);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(CommentAction.GET_COMMENTS);
  };

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
