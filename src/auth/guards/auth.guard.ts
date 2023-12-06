import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

enum JwtErrors {
  INVALID_ERROR = 'JsonWebTokenError',
  EXPIRED_ERROR = 'TokenExpiredError',
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({ mensagem: 'Não autorizado' });
    }

    const result = await this.verifyToken(token, process.env.JWT_SECRET);

    if (result.error === JwtErrors.INVALID_ERROR) {
      throw new UnauthorizedException({ mensagem: 'Não autorizado' });
    }

    if (result.error === JwtErrors.EXPIRED_ERROR) {
      throw new UnauthorizedException({ mensagem: 'Sessão inválida' });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string, secret: string) {
    try {
      await this.jwtService.verifyAsync(token, { secret });

      return {
        error: '',
      };
    } catch (error) {
      const err = error as Error;

      return {
        error: err.name,
      };
    }
  }
}
