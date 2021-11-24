import { ColumnInDB } from '../app/models/column';

const insertColumnToArr = (
  arr: ColumnInDB[],
  editableEl: ColumnInDB,
  newPosition: number,
  indexOldEl: number
): ColumnInDB[] => {
  if (editableEl.position < newPosition) {
    arr.splice(+newPosition + 1, 0, editableEl);
    arr.splice(indexOldEl, 1);
    return arr;
  }

  arr.splice(+newPosition, 0, editableEl);
  arr.splice(indexOldEl + 1, 1);
  return arr;
};

export default insertColumnToArr;
