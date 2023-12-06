import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: DeepMocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const user = new CreateUserDto();
      user.senha = '123';

      const findUserDto = new FindUserDto();

      usersRepository.findOneByEmail.mockResolvedValue(null);

      usersRepository.create.mockResolvedValue(findUserDto);

      await expect(service.create(user)).resolves.toBe(findUserDto);
    });

    it('should throw an exception if user email already exists', async () => {
      const user = new CreateUserDto();
      user.senha = '123';

      const findUserDto = new FindUserDto();

      usersRepository.findOneByEmail.mockResolvedValue(findUserDto);

      await expect(service.create(user)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user successfully', async () => {
      const id = '123';
      const findUserDto = new FindUserDto();

      usersRepository.findOne.mockResolvedValueOnce(findUserDto);

      await expect(service.findOne(id)).resolves.toBe(findUserDto);
    });

    it('should throw an exception if a user was not found', async () => {
      const id = '1';

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email successfully', async () => {
      const email = 'test@email';
      const findUserDto = new FindUserDto();

      usersRepository.findOneByEmail.mockResolvedValueOnce(findUserDto);

      await expect(service.findOneByEmail(email)).resolves.toBe(findUserDto);
    });
  });

  describe('findAll', () => {
    it('should find all users successfully', async () => {
      const findUserDto = new FindUserDto();

      usersRepository.findAll.mockResolvedValueOnce([findUserDto]);

      await expect(service.findAll()).resolves.toEqual([findUserDto]);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const id = '123';
      const findUserDto = new FindUserDto();

      usersRepository.update.mockResolvedValueOnce(findUserDto);

      await expect(service.update(id, new UpdateUserDto())).resolves.toBe(
        findUserDto,
      );
    });
  });
});
