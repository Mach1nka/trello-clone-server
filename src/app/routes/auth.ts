import express from 'express';
import { check } from 'express-validator';

import { logIn, register } from '../controllers/auth';

const router = express.Router();

router.post(
  '/login',
  [
    check('login', 'Please include a valid login').exists(),
    check('password', 'Password is required').exists(),
  ],
  logIn
);

router.post(
  '/sign-up',
  [
    check('login', 'Please include a valid login').exists(),
    check('password', 'Password is required').exists(),
  ],
  register
);

export { router };
