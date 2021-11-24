import { CommonError } from '../../types/errors';

class AlreadyExists extends CommonError {
  constructor(message = 'User already exists', statusCode = 400) {
    super(message, statusCode);
  }
}

export default AlreadyExists;
