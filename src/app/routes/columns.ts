import express from 'express';
import { check } from 'express-validator';

import {
  getColumns,
  createNewColumn,
  updateColumnName,
  updateColumnPosition,
  deleteColumn,
} from '../controllers/columns';
import { jwtAuthenticate } from '../middleware/passport';

const router = express.Router();

router.get('/columns/:boardId', jwtAuthenticate, getColumns);
router.post(
  '/column',
  [
    check('boardId', 'Board Id is required').exists(),
    check('name', 'Name is required').exists(),
    check('position', 'Position is required').exists().isNumeric(),
    jwtAuthenticate,
  ],
  createNewColumn
);
router.patch(
  '/column/name',
  [
    check('columnId', 'Column Id is required').exists(),
    check('newName', 'New name is required').exists(),
    jwtAuthenticate,
  ],
  updateColumnName
);
router.put('/column/position', jwtAuthenticate, updateColumnPosition);
router.delete('/column', jwtAuthenticate, deleteColumn);

export { router };
