import { Request, Response } from 'express';
import fs from 'fs';
import { validationResult } from 'express-validator';

import BaseResponse from '../../utils/base-response';
import BadRequest from '../../utils/errors/bad-request';

const getClientErrors = async (req: Request, res: Response): Promise<void> => {
  const { count = 0 } = req.params;
  const isLogsExists = fs.existsSync('./server/errors/logs.txt');

  if (!isLogsExists) {
    throw new BadRequest({});
  }

  fs.readFile('./server/errors/logs.txt', (err, data) => {
    if (err) {
      throw new BadRequest(err);
    }

    const errors = data.toString('utf-8');
    const arrayOfErrors = errors.split('///');
    const chooseErrors = arrayOfErrors.slice(-Number(count));

    res.json(new BaseResponse(chooseErrors));
  });
};

const saveClientError = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }
  const { error, errorInfo } = req.body;

  const isDirExists = fs.existsSync('./server/errors');

  if (!isDirExists) {
    fs.mkdir('./server/errors', (err) => {
      if (err) {
        throw new BadRequest(err);
      }
    });
  }

  fs.appendFile(
    './server/errors/logs.txt',
    `///\n${error} \t${errorInfo}\n`,
    (err) => {
      if (err) {
        throw new BadRequest(err);
      }
    }
  );

  res.json(new BaseResponse({}));
};

export { getClientErrors, saveClientError };
