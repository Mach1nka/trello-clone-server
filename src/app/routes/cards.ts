import express from 'express';
import { check } from 'express-validator';

import {
  getCards,
  createNewCard,
  updateCardName,
  updateCardDescription,
  updateCardPosition,
  changeCardStatus,
  deleteCard,
} from '../controllers/cards';
import { jwtAuthenticate } from '../middleware/passport';

const router = express.Router();

router.get('/cards/:columnId', jwtAuthenticate, getCards);

router.post(
  '/card',
  [
    check('columnId', 'Card Id is required').exists(),
    check('name', 'Name is required').exists(),
    jwtAuthenticate,
  ],
  createNewCard
);
router.patch(
  '/card/description',
  [check('cardId', 'Card Id is required').exists(), jwtAuthenticate],
  updateCardDescription
);

router.patch(
  '/card/name',
  [
    check('cardId', 'Card Id is required').exists(),
    check('newName', 'New name is required').exists(),
    jwtAuthenticate,
  ],
  updateCardName
);

router.put(
  '/card/position',
  [
    check('cardId', 'Card Id is required').exists(),
    check('columnId', 'Column Id is required').exists(),
    check('newPosition', 'New position Id is required').exists().isNumeric(),
    jwtAuthenticate,
  ],
  updateCardPosition
);

router.put(
  '/card/status',
  [
    check('cardId', 'Card Id is required').exists(),
    check('columnId', 'Column Id is required').exists(),
    check('newColumnId', 'New column is required').exists(),
    jwtAuthenticate,
  ],
  changeCardStatus
);

router.delete('/card', jwtAuthenticate, deleteCard);

export { router };
