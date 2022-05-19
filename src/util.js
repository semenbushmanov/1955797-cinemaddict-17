import dayjs from 'dayjs';

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomItem = (items) => items[getRandomNumber(0, items.length - 1)];
export const humanizeFilmReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
export const getYearFromDate = (date) => dayjs(date).format('YYYY');
export const getDurationInHours = (mins) => Math.floor(mins / 60);
export const getDurationInMins = (mins) => mins % 60;
export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
