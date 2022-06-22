import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const MINS_IN_HOUR = 60;

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const humanizeCommentDate = (date) => dayjs(date).fromNow();
export const getYearFromDate = (date) => dayjs(date).format('YYYY');
export const getDuration = (mins) => `${Math.floor(mins / MINS_IN_HOUR)}h ${mins % MINS_IN_HOUR}m`;
export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
export const isCtrlEnterKey = (evt) => evt.ctrlKey && evt.key === 'Enter';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

export const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
