import dayjs from 'dayjs';

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomItem = (items) => items[getRandomNumber(0, items.length - 1)];
export const humanizeFilmReleaseDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
