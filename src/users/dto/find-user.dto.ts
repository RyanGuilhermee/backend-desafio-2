import { CreateUserDto } from './create-user.dto';

export class FindUserDto extends CreateUserDto {
  id: string;
  token: string;
}
