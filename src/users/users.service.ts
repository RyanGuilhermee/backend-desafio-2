import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IUsersRepository,
  UsersRepository,
} from '../repositories/users.repository';
import { FindUserDto } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUsersRepository {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<FindUserDto> {
    const userExists = await this.findOneByEmail(createUserDto.email);

    if (userExists) {
      throw new ConflictException({ mensagem: 'E-mail já existente' });
    }

    createUserDto.senha = await bcrypt.hash(createUserDto.senha, 10);

    createUserDto.data_criacao = new Date(Date.now());
    createUserDto.data_atualizacao = new Date(Date.now());
    createUserDto.ultimo_login = new Date(Date.now());

    return this.usersRepository.create(createUserDto);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException({ mensagem: 'Usuário não encontrado' });
    }

    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<boolean> {
    return this.usersRepository.findOneByEmail(email);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }

    updateUserDto.data_atualizacao = new Date(Date.now());

    return this.usersRepository.update(id, updateUserDto);
  }
}
