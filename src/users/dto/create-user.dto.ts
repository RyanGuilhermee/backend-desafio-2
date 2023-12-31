import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsNotEmpty()
  telefones: [{ numero: string; ddd: string }];

  data_criacao: Date;

  data_atualizacao: Date;

  ultimo_login: Date;
}
