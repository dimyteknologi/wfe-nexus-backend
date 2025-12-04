import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class AssignPermissionToRoleDto {
  @ApiProperty({
    description: 'Role ID to assign permissions to',
    example: 'uuid-string-here'
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    description: 'Array of permission IDs to assign',
    example: ['permission-id-1', 'permission-id-2'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}

export class RemovePermissionFromRoleDto {
  @ApiProperty({
    description: 'Role ID to remove permissions from',
    example: 'uuid-string-here'
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    description: 'Array of permission IDs to remove',
    example: ['permission-id-1', 'permission-id-2'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
