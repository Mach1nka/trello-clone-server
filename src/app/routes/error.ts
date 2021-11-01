import express from 'express';
import { check } from 'express-validator';

import { getClientErrors, saveClientError } from '../controllers/errors';

const router = express.Router();

router.get('/errors/:count', getClientErrors);

router.post(
  '/error',
  [
    check('error', 'Error must be string').exists().isString(),
    check('errorInfo', 'Error Info must be stringd').exists().isString(),
  ],
  saveClientError
);

export { router };
