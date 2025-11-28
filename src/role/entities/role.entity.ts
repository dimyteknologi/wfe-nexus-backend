import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Role UUID' })
  id: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  name: string;

  @ApiProperty({ example: '2024-01-15T08:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T10:15:00.000Z', nullable: true, description: 'Last update timestamp' })
  updatedAt: Date | null;

  @ApiProperty({ example: null, nullable: true, description: 'Deletion timestamp (soft delete)' })
  deletedAt: Date | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID of user who last updated' })
  updatedBy: string;
}

export class PermissionEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'Permission UUID' })
  id: string;

  @ApiProperty({ example: 'manage:user', description: 'Permission code' })
  permissionCode: string;

  @ApiProperty({ example: 'Manage Users', description: 'Permission name' })
  permissionName: string;

  @ApiProperty({ example: 'Allows user management operations', nullable: true, description: 'Permission description' })
  description: string | null;
}

export class RoleWithPermissionsEntity extends RoleEntity {
  @ApiProperty({ 
    type: [PermissionEntity], 
    description: 'Permissions assigned to this role',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        permissionCode: 'manage:user',
        permissionName: 'Manage Users',
        description: 'Allows user management operations'
      }
    ]
  })
  permissions: PermissionEntity[];
}

export class DeleteRoleResponseDto {
  @ApiProperty({ example: 'Role deleted successfully', description: 'Success message' })
  message: string;

  @ApiProperty({ type: RoleEntity })
  role: RoleEntity;
}
