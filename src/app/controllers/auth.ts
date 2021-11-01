import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import jwtCreator from '../../utils/jwt-creator';
import BadRequest from '../../utils/errors/bad-request';
import BaseResponse from '../../utils/base-response';
import { loginService, registerService } from '../services/auth';

const logIn = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  const user = await loginService(req.body);
  const token = jwtCreator(user.login, user._id);

  res.json(new BaseResponse({ login: user.login, token, id: user._id }));
};

const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  const createdUser = await registerService(req.body);
  const token = jwtCreator(createdUser.login, createdUser._id);

  res
    .status(201)
    .json(
      new BaseResponse(
        { login: createdUser.login, token, id: createdUser._id },
        201
      )
    );
};

export { logIn, register };
