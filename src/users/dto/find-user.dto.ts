export class FindUserDto {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefones: [{ numero: string; ddd: string }];
  data_criacao: Date;
  data_atualizacao: Date;
  ultimo_login: Date;
}
