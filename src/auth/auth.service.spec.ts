import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from '../users/dto/find-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: DeepMocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in an user successfully', async () => {
      const findUserDto = new FindUserDto();

      usersService.findOneByEmail.mockResolvedValueOnce(findUserDto);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      await expect(service.signIn('test@email', 'senha')).resolves.toEqual(
        findUserDto,
      );
    });

    it('should throw an exception if user email is wrong', async () => {
      usersService.findOneByEmail.mockResolvedValueOnce(null);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.signIn('test2@email', 'senha'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw an exception if user password is wrong', async () => {
      usersService.findOneByEmail.mockResolvedValueOnce(new FindUserDto());

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(service.signIn('test@email', '')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
