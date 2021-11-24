import { CommonError } from '../../types/errors';

class InvalidCredentials extends CommonError {
  constructor(message = 'Invalid Credentials', statusCode = 401) {
    super(message, statusCode);
  }
}

export default InvalidCredentials;
