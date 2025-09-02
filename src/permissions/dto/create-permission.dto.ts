import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission code (unique identifier)',
    example: 'manage:products',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  permissionCode: string;

  @ApiProperty({
    description: 'Human readable permission name',
    example: 'Manage Products',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  permissionName: string;
}
