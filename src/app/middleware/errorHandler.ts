import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next): void => {
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
