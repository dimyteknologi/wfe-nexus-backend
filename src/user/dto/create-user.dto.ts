import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsUUID()
  roleId: string;

  @IsUUID()
  kotaId: string;
}
