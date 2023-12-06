import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const mensagem = exception.getResponse();

    if (
      status === HttpStatus.NOT_FOUND &&
      exception.message === 'Not Found Exception'
    ) {
      response.status(status).json(mensagem);
    } else {
      response.status(404).json({ mensagem: 'Endpoint não encontrado' });
    }
  }
}
