import dayjs from 'dayjs';

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
export const getYearFromDate = (date) => dayjs(date).format('YYYY');
export const getDurationInHours = (mins) => Math.floor(mins / 60);
export const getDurationInMins = (mins) => mins % 60;
