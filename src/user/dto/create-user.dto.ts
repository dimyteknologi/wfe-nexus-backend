import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'master@admin.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'masteradmin@123',
    description: 'The password for the user account',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

   @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'The UUID of the role assigned to the user',
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    example: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
    description: 'The UUID of the city the user belongs to',
  })
  @IsUUID()
  cityId: string;

  @ApiProperty({
    example: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
    description: 'The UUID of the institution the user belongs to',
  })
  @IsUUID()
  institutionId: string;
}
