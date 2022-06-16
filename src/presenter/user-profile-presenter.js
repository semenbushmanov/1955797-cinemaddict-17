import { render, replace, remove } from '../framework/render.js';
import UserProfileView from '../view/user-profile-view.js';
import { filter } from '../utils/filter.js';

export default class UserProfilePresenter {
  #userProfileContainer = null;
  #filmsModel = null;

  #userProfileComponent = null;

  constructor(userProfileContainer, filmsModel) {
    this.#userProfileContainer = userProfileContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const previousUserProfileComponent = this.#userProfileComponent;
    const watchedFilms = filter.history(this.#filmsModel.films).length;

    if (watchedFilms === 0) {
      if (previousUserProfileComponent !== null) {
        remove(previousUserProfileComponent);
        this.#userProfileComponent = null;
      }

      return;
    }

    const userRank = this.#getUserRank(watchedFilms);

    this.#userProfileComponent = new UserProfileView(userRank);

    if (previousUserProfileComponent === null) {
      render(this.#userProfileComponent, this.#userProfileContainer);
      return;
    }

    replace(this.#userProfileComponent, previousUserProfileComponent);
    remove(previousUserProfileComponent);
  };

  #getUserRank = (watchedFilms) => {
    if (watchedFilms < 11) {
      return 'Novice';
    }

    if (watchedFilms < 21) {
      return 'Fan';
    }

    return 'Movie Buff';
  };

  #handleModelEvent = () => {
    this.init();
  };
}
