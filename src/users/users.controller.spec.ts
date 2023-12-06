import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: DeepMocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user successfully', async () => {
      const id = '123';
      const findUserDto = new FindUserDto();

      usersService.findOne.mockResolvedValueOnce(findUserDto);

      await expect(controller.findOne(id)).resolves.toEqual(findUserDto);
    });
  });

  describe('findAll', () => {
    it('should find all users successfully', async () => {
      const findUserDto = new FindUserDto();

      usersService.findAll.mockResolvedValueOnce([findUserDto]);

      await expect(controller.findAll()).resolves.toEqual([findUserDto]);
    });
  });

  describe('update', () => {
    it('should update a user successfuly', async () => {
      const id = '123';
      const updateUser = new UpdateUserDto();
      const findUserDto = new FindUserDto();

      usersService.update.mockResolvedValueOnce(findUserDto);

      await expect(controller.update(id, updateUser)).resolves.toEqual(
        findUserDto,
      );
    });
  });
});
