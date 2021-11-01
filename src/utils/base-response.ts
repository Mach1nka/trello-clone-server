class BaseResponse<T> {
  statusCode: number;

  data: T;

  constructor(data: T, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default BaseResponse;
