import { CardInDB } from '../app/models/card';

const insertCardToArr = (
  arr: CardInDB[],
  editableEl: CardInDB,
  newPosition: number,
  indexOldEl: number
): CardInDB[] => {
  if (editableEl.position < newPosition) {
    arr.splice(+newPosition + 1, 0, editableEl);
    arr.splice(indexOldEl, 1);
    return arr;
  }

  arr.splice(+newPosition, 0, editableEl);
  arr.splice(indexOldEl + 1, 1);
  return arr;
};

export default insertCardToArr;
