import { filter } from '../utils/filter.js';

export const generateFiltersData = (films) => ({
  all: {name: 'All movies', count: filter.all(films).length},
  watchlist: {name: 'Watchlist ', count: filter.watchlist(films).length},
  history: {name: 'History ', count: filter.history(films).length},
  favorites: {name: 'Favorites ', count: filter.favorites(films).length}
});
