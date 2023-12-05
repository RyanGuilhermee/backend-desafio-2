import { FindUserDto } from '../users/dto/find-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../users/dto/update-user.dto';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<FindUserDto>;

  update(id: string, updateUserDto: UpdateUserDto): Promise<FindUserDto>;

  findOne(id: string): Promise<FindUserDto>;

  findOneByEmail(email: string): Promise<FindUserDto | null>;

  findAll(): Promise<FindUserDto[]>;
}

@Injectable()
export class UsersRepository extends PrismaClient implements IUsersRepository {
  async create(createUserDto: CreateUserDto): Promise<FindUserDto> {
    const user = await this.usuario.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: createUserDto.senha,
        data_criacao: createUserDto.data_criacao,
        data_atualizacao: createUserDto.data_atualizacao,
        ultimo_login: createUserDto.ultimo_login,
      },
    });

    const userDto = new FindUserDto();
    userDto.id = user.id;
    userDto.data_criacao = user.data_criacao;
    userDto.data_atualizacao = user.data_atualizacao;
    userDto.ultimo_login = user.ultimo_login;

    return userDto;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<FindUserDto> {
    const user = await this.usuario.update({
      where: { id },
      data: {
        nome: updateUserDto.nome,
        email: updateUserDto.email,
        senha: updateUserDto.senha,
        data_atualizacao: updateUserDto.data_atualizacao,
      },
    });

    const userDto = new FindUserDto();
    userDto.id = user.id;
    userDto.data_criacao = user.data_criacao;
    userDto.data_atualizacao = user.data_atualizacao;
    userDto.ultimo_login = user.ultimo_login;

    return userDto;
  }

  async findOne(id: string): Promise<FindUserDto | null> {
    const user = await this.usuario.findFirst({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const userDto = new FindUserDto();
    userDto.id = user.id;
    userDto.nome = user.nome;
    userDto.email = user.email;
    userDto.senha = user.senha;

    return userDto;
  }

  async findOneByEmail(email: string): Promise<FindUserDto | null> {
    const user = await this.usuario.findFirst({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const userDto = new FindUserDto();
    userDto.id = user.id;
    userDto.nome = user.nome;
    userDto.email = user.email;
    userDto.senha = user.senha;

    return userDto;
  }

  async findAll(): Promise<FindUserDto[]> {
    const users = await this.usuario.findMany();

    const usersDto = users.map((user) => {
      const userDto = new FindUserDto();
      userDto.id = user.id;
      userDto.nome = user.nome;
      userDto.email = user.email;
      userDto.senha = user.senha;

      return userDto;
    });

    return usersDto;
  }
}
