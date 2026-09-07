import {ArgumentsHost, Catch, HttpException, HttpStatus} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost,} from '@nestjs/core';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as { message: string | string[] }).message;
      }
    } else if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as { code?: string };

      if (driverError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Resource with these unique features already exists.';
      } else if (driverError.code === '23503') {
        status = HttpStatus.CONFLICT;
        message = 'Operation conflicts with related data.';
      } else if (driverError.code === '23502') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Required database feature is missing.';
      }
    }

    if (request.path.startsWith('/api/')) {
      response.status(status).json({
        statusCode: status,
        message,
        path: request.originalUrl,
        timestamp: new Date().toISOString(),
      });

      return;
    }

    if (request.accepts('html')) {
      const displayMessage = Array.isArray(message) ? message.join(', ') : message;

      response.status(status).render('error', {
        statusCode: status,
        title: status === HttpStatus.NOT_FOUND ? 'Страница не найдена' : 'Ошибка',
        message: displayMessage,
        path: request.originalUrl,
      });

      return;
    }

    return super.catch(exception, host);
  }
}