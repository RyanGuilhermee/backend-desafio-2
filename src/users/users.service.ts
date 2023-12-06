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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService implements IUsersRepository {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findOneByEmail(createUserDto.email);

    if (userExists) {
      throw new ConflictException({ mensagem: 'E-mail já existente' });
    }

    createUserDto.senha = await bcrypt.hash(createUserDto.senha, 10);

    createUserDto.data_criacao = new Date(Date.now());
    createUserDto.data_atualizacao = new Date(Date.now());
    createUserDto.ultimo_login = new Date(Date.now());

    const user = await this.usersRepository.create(createUserDto);

    return {
      ...user,
      token: await this.jwtService.signAsync(
        { user_id: user.id },
        { secret: process.env.JWT_SECRET },
      ),
    };
  }

  async findOne(id: string): Promise<FindUserDto> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException({ mensagem: 'Usuário não encontrado' });
    }

    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<FindUserDto | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  findAll(): Promise<FindUserDto[]> {
    return this.usersRepository.findAll();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<FindUserDto> {
    await this.findOne(id);

    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }

    updateUserDto.data_atualizacao = new Date(Date.now());

    return this.usersRepository.update(id, updateUserDto);
  }
}
