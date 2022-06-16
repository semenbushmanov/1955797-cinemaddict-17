import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const release = {...film.filmInfo.release,
      'release_country': film.filmInfo.release.releaseCountry,
    };

    delete release.releaseCountry;

    const filmInfo = {...film.filmInfo,
      'alternative_title': film.filmInfo.alternativeTitle,
      'total_rating': film.filmInfo.totalRating,
      'age_rating': film.filmInfo.ageRating,
      release: release,
    };

    delete filmInfo.alternativeTitle;
    delete filmInfo.totalRating;
    delete filmInfo.ageRating;

    const userDetails = {...film.userDetails,
      'already_watched': film.userDetails.alreadyWatched,
      'watching_date': film.userDetails.watchingDate,
    };

    delete userDetails.alreadyWatched;
    delete userDetails.watchingDate;

    const adaptedFilm = {...film,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };
}
