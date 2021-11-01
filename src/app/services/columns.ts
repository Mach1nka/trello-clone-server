import Column, { ColumnInDB } from '../models/column';
import Card from '../models/card';
import BadRequest from '../../utils/errors/bad-request';
import NotFound from '../../utils/errors/not-found';
import { BulkUpdate, BulkPosition } from '../../types/bulkarr';
import insertColumnToArr from '../../utils/insert-column';

interface FilteredColumn {
  id: string;
  name: string;
  boardId: string;
  position: number;
}

interface BodyForCreatColumn {
  position: number;
  boardId: string;
  name: string;
}

interface BodyForRenameColumn {
  columnId: string;
  newName: string;
}

interface BodyForRepositionColumn {
  columnId: string;
  boardId: string;
  newPosition: number;
}

interface BodyForDeleteColumn {
  columnId: string;
  boardId: string;
}

const getColumnsService = async (
  boardId: string
): Promise<FilteredColumn[]> => {
  const columnsArr = await Column.find({ boardId });

  if (columnsArr.length) {
    const preparedArr: FilteredColumn[] = columnsArr.map((el) => ({
      id: String(el._id),
      name: el.name,
      position: el.position,
      boardId: el.boardId,
    }));
    return preparedArr;
  }
  return [];
};

const createColumnService = async (
  reqBody: BodyForCreatColumn
): Promise<FilteredColumn> => {
  const { position, name, boardId } = reqBody;

  const newColumn = Column.build({
    boardId,
    name,
    position: Number(position),
  });

  await newColumn.save();
  const columnsData = await Column.find({ boardId });
  const bulkArr: BulkUpdate<BulkPosition>[] = [];

  columnsData.sort((a, b) => a.position - b.position);
  const elementsWithUpdatedPos: FilteredColumn[] = columnsData.map(
    (el, idx) => ({
      id: String(el._id),
      name: el.name,
      position: idx,
      boardId: el.boardId,
    })
  );

  elementsWithUpdatedPos.forEach((el) => {
    bulkArr.push({
      updateOne: {
        filter: { _id: el.id },
        update: { position: el.position },
      },
    });
  });

  await Column.bulkWrite(bulkArr);
  const createdColumn = await Column.findById(newColumn._id);

  if (!createdColumn) {
    throw new NotFound();
  }

  const preparedData: FilteredColumn = {
    id: String(createdColumn._id),
    boardId: createdColumn.boardId,
    name: createdColumn.name,
    position: createdColumn.position,
  };

  return preparedData;
};

const updateNameService = async (
  reqBody: BodyForRenameColumn
): Promise<FilteredColumn> => {
  const { columnId, newName } = reqBody;
  const renamedColumn: ColumnInDB | null = await Column.findByIdAndUpdate(
    columnId,
    { name: newName },
    { new: true }
  );

  if (!renamedColumn) {
    throw new NotFound();
  }

  const preparedData = {
    id: String(renamedColumn._id),
    boardId: renamedColumn.boardId,
    name: renamedColumn.name,
    position: renamedColumn.position,
  };

  return preparedData;
};

const updatePositionService = async (
  reqBody: BodyForRepositionColumn
): Promise<FilteredColumn[]> => {
  const { columnId, boardId, newPosition } = reqBody;
  const bulkArr: BulkUpdate<BulkPosition>[] = [];

  const columnsArr = await Column.find({ boardId });
  columnsArr.sort((a, b) => a.position - b.position);

  const indexOldEl = columnsArr.findIndex(
    (el) => el._id.toString() === columnId
  );
  const editableEl = columnsArr.find((el) => el._id.toString() === columnId);

  if (!editableEl) {
    throw new BadRequest();
  }

  const updatedArr: ColumnInDB[] = insertColumnToArr(
    columnsArr,
    editableEl,
    newPosition,
    indexOldEl
  );

  const elementsWithUpdatedPos: FilteredColumn[] = updatedArr.map(
    (el, idx) => ({
      id: String(el._id),
      boardId: el.boardId,
      name: el.name,
      position: idx,
    })
  );

  elementsWithUpdatedPos.forEach((el) => {
    bulkArr.push({
      updateOne: {
        filter: { _id: el.id },
        update: { position: el.position },
      },
    });
  });

  await Column.bulkWrite(bulkArr);
  return elementsWithUpdatedPos;
};

const deleteService = async (reqBody: BodyForDeleteColumn): Promise<void> => {
  const { columnId, boardId } = reqBody;
  const bulkArr: BulkUpdate<BulkPosition>[] = [];

  await Column.findByIdAndDelete(columnId);
  await Card.deleteMany({ columnId });

  const columns: ColumnInDB[] = await Column.find({ boardId });
  const elementsWithUpdatedPos: FilteredColumn[] = columns.map((el, idx) => ({
    id: String(el._id),
    boardId: el.boardId,
    name: el.name,
    position: idx,
  }));

  elementsWithUpdatedPos.forEach((el) => {
    bulkArr.push({
      updateOne: {
        filter: { _id: el.id },
        update: { position: el.position },
      },
    });
  });

  await Column.bulkWrite(bulkArr);
};

export {
  getColumnsService,
  createColumnService,
  updateNameService,
  updatePositionService,
  deleteService,
};
