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

  addComment = async (updateType, comment, film) => {
    try {
      const response = await this.#filmsApiService.addComment(comment, film);
      this.#comments = response.comments;
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteComment(commentId);
      this.#comments.splice(index, 1);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
