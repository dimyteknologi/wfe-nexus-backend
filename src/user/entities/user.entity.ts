import { ApiProperty } from '@nestjs/swagger';

export class CityEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'City UUID' })
  id: string;

  @ApiProperty({ example: 'Jakarta', description: 'City name' })
  name: string;
}

export class InstitutionEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'Institution UUID' })
  id: string;

  @ApiProperty({ example: 'Universitas Indonesia', description: 'Institution name' })
  name: string;
}

export class RoleEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'Role UUID' })
  id: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  name: string;
}

export class UserEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003', description: 'User UUID' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'Role ID' })
  roleId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'City ID' })
  cityId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'Institution ID' })
  institutionId: string;

  @ApiProperty({ example: '2024-01-15T08:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T10:15:00.000Z', nullable: true, description: 'Last update timestamp' })
  updatedAt: Date | null;

  @ApiProperty({ example: null, nullable: true, description: 'Deletion timestamp (soft delete)' })
  deletedAt: Date | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004', description: 'ID of user who last updated' })
  updatedBy: string;
}

export class UserWithRelationsEntity extends UserEntity {
  @ApiProperty({ type: RoleEntity, description: 'User role information' })
  role: RoleEntity;

  @ApiProperty({ type: CityEntity, description: 'User city information' })
  cities: CityEntity;

  @ApiProperty({ type: InstitutionEntity, description: 'User institution information' })
  institution: InstitutionEntity;
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'User deleted successfully', description: 'Success message' })
  message: string;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}

export class CountUserResponseDto {
  @ApiProperty({ example: 42, description: 'Total number of users' })
  total: number;
}
