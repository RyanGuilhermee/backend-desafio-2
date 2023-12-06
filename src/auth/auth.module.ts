import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../repositories/users.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: 60 * 30 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UsersRepository],
})
export class AuthModule {}
