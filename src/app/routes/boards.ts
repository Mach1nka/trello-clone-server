import express from 'express';
import { check } from 'express-validator';

import {
  getAllBoards,
  createNewBoard,
  deleteBoard,
  updateBoardName,
  shareBoard,
} from '../controllers/boards';
import { jwtAuthenticate } from '../middleware/passport';

const router = express.Router();

router.get('/boards', jwtAuthenticate, getAllBoards);

router.post(
  '/board',
  [
    check('userId', 'User Id is required').exists(),
    check('name', 'Name is required').exists(),
    jwtAuthenticate,
  ],
  createNewBoard
);

router.patch(
  '/board/rename',
  [
    check('boardId', 'Board Id is required').exists(),
    check('newName', 'New name is required').exists(),
    check('userId', 'User Id is required').exists(),
    jwtAuthenticate,
  ],
  updateBoardName
);

router.patch(
  '/board/share',
  [
    check('boardId', 'Board Id is required').exists(),
    check('userId', 'User Id is required').exists(),
    jwtAuthenticate,
  ],
  shareBoard
);

router.delete(
  '/board',
  [
    check('boardId', 'Board Id is required').exists(),
    check('userId', 'User Id is required').exists(),
    jwtAuthenticate,
  ],
  deleteBoard
);

export { router };
