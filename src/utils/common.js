export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomItem = (items) => items[getRandomNumber(0, items.length - 1)];
export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
