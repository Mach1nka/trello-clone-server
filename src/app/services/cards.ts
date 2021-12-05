import Card, { CardInDB } from '../models/card';
import { BulkUpdate, BulkPosition } from '../../types/bulkarr';
import BadRequest from '../../utils/errors/bad-request';
import NotFound from '../../utils/errors/not-found';
import insertCardToArr from '../../utils/insert-card';

interface FilteredCard {
  id: string;
  name: string;
  description: string;
  position: number;
  columnId: string;
}

interface BodyForCreatCard {
  name: string;
  columnId: string;
  description: string;
  position: number;
}

interface BodyForRenameCard {
  cardId: string;
  newName: string;
}

interface BodyForUpdateDescription {
  cardId: string;
  newDescription: string;
}

interface BodyForUpdatePos {
  cardId: string;
  columnId: string;
  newPosition: number;
}

interface BodyForUpdateStatus {
  columnId: string;
  newColumnId: string;
  cardId: string;
  newPosition: number;
}

interface BodyForDelete {
  cardId: string;
  columnId: string;
}

const getCardsService = async (columnId: string): Promise<FilteredCard[]> => {
  const cardsArr: CardInDB[] = await Card.find({ columnId }).sort({
    position: 1,
  });

  if (cardsArr.length) {
    const preparedArr: FilteredCard[] = cardsArr.map((el) => ({
      id: el._id,
      name: el.name,
      description: el.description,
      position: el.position,
      columnId: el.columnId,
    }));
    return preparedArr;
  }
  return [];
};

const createCardService = async (
  reqBody: BodyForCreatCard
): Promise<FilteredCard> => {
  const { columnId, name, description } = reqBody;

  const cardsWithoutNew: CardInDB[] = await Card.find({ columnId });

  const newCard = Card.build({
    columnId,
    name,
    description,
    position: cardsWithoutNew.length,
  });

  const createdCard = await newCard.save();

  return {
    id: createdCard._id,
    columnId: createdCard.columnId,
    name: createdCard.name,
    description: createdCard.description,
    position: createdCard.position,
  };
};

const updateNameService = async (
  reqBody: BodyForRenameCard
): Promise<FilteredCard> => {
  const { cardId, newName } = reqBody;
  const updatedCard: CardInDB | null = await Card.findByIdAndUpdate(
    cardId,
    { name: newName },
    { new: true }
  );

  if (!updatedCard) {
    throw new NotFound();
  }

  return {
    id: updatedCard._id,
    columnId: updatedCard.columnId,
    name: updatedCard.name,
    description: updatedCard.description,
    position: updatedCard.position,
  };
};

const updateDescriptionService = async (
  reqBody: BodyForUpdateDescription
): Promise<FilteredCard> => {
  const { cardId, newDescription } = reqBody;
  const updatedCard: CardInDB | null = await Card.findByIdAndUpdate(
    cardId,
    { description: newDescription },
    { new: true }
  );

  if (!updatedCard) {
    throw new NotFound();
  }

  return {
    id: updatedCard._id,
    columnId: updatedCard.columnId,
    name: updatedCard.name,
    description: updatedCard.description,
    position: updatedCard.position,
  };
};

const updatePositionService = async (
  reqBody: BodyForUpdatePos
): Promise<FilteredCard[]> => {
  const { columnId, newPosition, cardId } = reqBody;
  const bulkArr: BulkUpdate<BulkPosition>[] = [];
  const cardsArr: CardInDB[] = await Card.find({ columnId }).sort({
    position: 1,
  });

  const indexOldEl = cardsArr.findIndex((el) => el._id.toString() === cardId);
  const editableEl: CardInDB | undefined = cardsArr.find(
    (el) => el._id.toString() === cardId
  );

  if (!editableEl) {
    throw new BadRequest();
  }

  const updatedArr: CardInDB[] = insertCardToArr(
    cardsArr,
    editableEl,
    newPosition,
    indexOldEl
  );

  const elementsWithUpdatedPos: FilteredCard[] = updatedArr.map((el, idx) => ({
    id: el._id,
    columnId: el.columnId,
    name: el.name,
    description: el.description,
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

  await Card.bulkWrite(bulkArr);
  return elementsWithUpdatedPos;
};

const updateStatusService = async (
  reqBody: BodyForUpdateStatus
): Promise<void> => {
  const { columnId, newColumnId, cardId, newPosition = 0 } = reqBody;

  await Card.findByIdAndUpdate(cardId, {
    columnId: newColumnId,
    position: newPosition,
  });

  const oldStatusArr: CardInDB[] = await Card.find({ columnId });
  const oldStatusBulkArr: BulkUpdate<BulkPosition>[] = [];

  const oldStatusArrWithUpdatedPos: FilteredCard[] = oldStatusArr.map(
    (el, idx) => ({
      id: el._id,
      columnId: el.columnId,
      name: el.name,
      description: el.description,
      position: idx,
    })
  );

  oldStatusArrWithUpdatedPos.forEach((el) => {
    oldStatusBulkArr.push({
      updateOne: {
        filter: { _id: el.id },
        update: { position: el.position },
      },
    });
  });
  await Card.bulkWrite(oldStatusBulkArr);

  const newStatusArr: CardInDB[] = await Card.find({
    columnId: newColumnId,
  }).sort({ position: 1 });
  const newStatusBulkArr: BulkUpdate<BulkPosition>[] = [];

  const indexOldEl = newStatusArr.findIndex(
    (el) => el._id.toString() === cardId
  );
  const editableEl: CardInDB | undefined = newStatusArr.find(
    (el) => el._id.toString() === cardId
  );

  if (!editableEl) {
    throw new BadRequest();
  }

  const updatedArr: CardInDB[] = insertCardToArr(
    newStatusArr,
    editableEl,
    newPosition,
    indexOldEl
  );

  const newStatusArrWithUpdatedPos: FilteredCard[] = updatedArr.map(
    (el, idx) => ({
      id: el._id,
      columnId: el.columnId,
      name: el.name,
      description: el.description,
      position: idx,
    })
  );

  newStatusArrWithUpdatedPos.forEach((el) => {
    newStatusBulkArr.push({
      updateOne: {
        filter: { _id: el.id },
        update: { position: el.position },
      },
    });
  });

  await Card.bulkWrite(newStatusBulkArr);
};

const deleteService = async (reqBody: BodyForDelete): Promise<void> => {
  const { cardId, columnId } = reqBody;

  await Card.findByIdAndDelete(cardId);
  const cardsArr: CardInDB[] = await Card.find({ columnId });

  if (cardsArr.length) {
    const bulkArr: BulkUpdate<BulkPosition>[] = [];

    const elementsWithUpdatedPos: FilteredCard[] = cardsArr.map((el, idx) => ({
      id: el._id,
      columnId: el.columnId,
      name: el.name,
      description: el.description,
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

    await Card.bulkWrite(bulkArr);
  }
};

export {
  getCardsService,
  createCardService,
  updateNameService,
  updateDescriptionService,
  updatePositionService,
  updateStatusService,
  deleteService,
};
