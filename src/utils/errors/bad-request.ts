import { ValidationError } from 'express-validator';

import { CommonError } from '../../types/errors';

class BadRequest extends CommonError {
  errors: Partial<ValidationError>;

  constructor(errors = {}, message = 'Bad Request', statusCode = 400) {
    super(message, statusCode);
    this.errors = errors;
  }
}

export default BadRequest;
