import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SignInDto } from './dto/signin.dto';
import { FindUserDto } from '../users/dto/find-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMocked<AuthService>;
  let usersService: DeepMocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in an user successfully', async () => {
      const findUserDto = new FindUserDto();

      authService.signIn.mockResolvedValue(findUserDto);

      await expect(controller.signIn(new SignInDto())).resolves.toEqual(
        findUserDto,
      );
    });
  });

  describe('signUp', () => {
    it('should sign up an user successfully', async () => {
      const findUserDto = new FindUserDto();

      usersService.create.mockResolvedValue(findUserDto);

      await expect(controller.signUp(new CreateUserDto())).resolves.toEqual(
        findUserDto,
      );
    });
  });
});
