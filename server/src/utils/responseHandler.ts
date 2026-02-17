import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  static error(res: Response, message: string = 'Error', statusCode: number = 400, errors?: Record<string, string[]>) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      statusCode,
    });
  }

  static badRequest(res: Response, message: string = 'Bad Request', errors?: Record<string, string[]>) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not Found') {
    return this.error(res, message, 404);
  }

  static internalError(res: Response, message: string = 'Internal Server Error') {
    return this.error(res, message, 500);
  }
}
