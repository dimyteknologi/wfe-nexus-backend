import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'Permission code (unique identifier)',
    example: 'manage:products',
    minLength: 3,
    maxLength: 50,
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  permissionCode?: string;

  @ApiProperty({
    description: 'Human readable permission name',
    example: 'Manage Products',
    minLength: 3,
    maxLength: 100,
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  permissionName?: string;
}
