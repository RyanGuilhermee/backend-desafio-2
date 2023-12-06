import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    const isPassword = user ? await bcrypt.compare(password, user.senha) : null;

    if (!user || !isPassword) {
      throw new UnauthorizedException({
        mensagem: 'Usuário e/ou senha inválidos',
      });
    }

    await this.usersService.update(user.id, {
      ultimo_login: new Date(Date.now()),
    });

    return {
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token: await this.jwtService.signAsync(
        { user_id: user.id },
        { secret: process.env.JWT_SECRET },
      ),
    };
  }
}
