import { NextResponse, NextRequest } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export class ApiHandler {
  static success<T>(data: T, message: string = 'Success', statusCode: number = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        statusCode,
      },
      { status: statusCode }
    );
  }

  static error(message: string = 'Error', statusCode: number = 400, errors?: Record<string, string[]>): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
        statusCode,
      },
      { status: statusCode }
    );
  }

  static badRequest(message: string = 'Bad Request', errors?: Record<string, string[]>): NextResponse<ApiResponse> {
    return this.error(message, 400, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error(message, 403);
  }

  static notFound(message: string = 'Not Found'): NextResponse<ApiResponse> {
    return this.error(message, 404);
  }

  static internalError(message: string = 'Internal Server Error'): NextResponse<ApiResponse> {
    return this.error(message, 500);
  }

  static async handleError(error: any, defaultMessage: string = 'An error occurred'): Promise<NextResponse<ApiResponse>> {
    console.error('API Error:', error);

    if (error instanceof Error) {
      return this.error(error.message, 500);
    }

    return this.internalError(defaultMessage);
  }
}
