import express from 'express';

import { getUsers } from '../controllers/users';
import { jwtAuthenticate } from '../middleware/passport';

const router = express.Router();

router.get('/users/:searchValue', jwtAuthenticate, getUsers);

export { router };
