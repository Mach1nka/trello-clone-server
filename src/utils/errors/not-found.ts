import { CommonError } from '../../types/errors';

class NotFound extends CommonError {
  constructor(message = 'Not Found', statusCode = 404) {
    super(message, statusCode);
  }
}

export default NotFound;
