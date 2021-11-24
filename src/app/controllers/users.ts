import { Request, Response } from 'express';

import InvalidCredentials from '../../utils/errors/invalid-credentials';
import BaseResponse from '../../utils/base-response';
import getUsersService from '../services/users';

const getUsers = async (req: Request, res: Response): Promise<void> => {
  const id = req.user?._id;
  const { searchValue } = req.params;

  if (!id) {
    throw new InvalidCredentials();
  }

  const users = await getUsersService(searchValue, id);

  res.json(new BaseResponse(users));
};

export { getUsers };
