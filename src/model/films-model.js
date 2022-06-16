import Observable from '../framework/observable.js';
import { generateFilmDescription } from '../mock/film-data.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = Array.from({ length: 23 }, generateFilmDescription);

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;

    this.#filmsApiService.films.then((films) => {
      console.log(films.map(this.#adaptToClient));
    });
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
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
