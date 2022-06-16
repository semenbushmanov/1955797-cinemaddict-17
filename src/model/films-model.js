import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const release = {...film['film_info']['release'],
      releaseCountry: film['film_info']['release']['release_country'],
    };

    delete release['release_country'];

    const filmInfo = {...film['film_info'],
      alternativeTitle: film['film_info']['alternative_title'],
      totalRating: film['film_info']['total_rating'],
      ageRating: film['film_info']['age_rating'],
      release: release,
    };

    delete filmInfo['alternative_title'];
    delete filmInfo['total_rating'];
    delete filmInfo['age_rating'];

    const userDetails = {...film['user_details'],
      alreadyWatched: film['user_details']['already_watched'],
      watchingDate: film['user_details']['watching_date'],
    };

    delete userDetails['already_watched'];
    delete userDetails['watching_date'];

    const adaptedFilm = {...film,
      filmInfo: filmInfo,
      userDetails: userDetails,
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  };
}
