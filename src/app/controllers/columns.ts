import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import {
  getColumnsService,
  createColumnService,
  updateNameService,
  updatePositionService,
  deleteService,
} from '../services/columns';
import BaseResponse from '../../utils/base-response';
import BadRequest from '../../utils/errors/bad-request';

const getColumns = async (req: Request, res: Response): Promise<void> => {
  const { boardId } = req.params;

  const columns = await getColumnsService(boardId);
  res.json(new BaseResponse(columns));
};

const createNewColumn = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  const createdColumn = await createColumnService(req.body);
  res.status(201).json(new BaseResponse(createdColumn, 201));
};

const updateColumnName = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  const renamedColumn = await updateNameService(req.body);
  res.json(new BaseResponse(renamedColumn));
};

const updateColumnPosition = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  const elementsWithUpdatedPos = await updatePositionService(req.body);
  res.json(new BaseResponse(elementsWithUpdatedPos));
};

const deleteColumn = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array());
  }

  await deleteService(req.body);
  res.status(200).json(new BaseResponse({}, 200));
};

export {
  getColumns,
  createNewColumn,
  updateColumnName,
  updateColumnPosition,
  deleteColumn,
};
