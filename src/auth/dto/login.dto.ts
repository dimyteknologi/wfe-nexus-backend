import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'master@admin.com',
    description: 'The email address for the user to log in',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'masteradmin@123',
    description: 'The password for the user account',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}