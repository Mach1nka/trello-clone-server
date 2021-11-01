import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server error';
  const errors = err.errors || {};

  res.status(statusCode).json({
    statusCode,
    message,
    errors,
  });
};

export default errorHandler;
