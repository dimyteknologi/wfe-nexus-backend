import { ApiProperty } from '@nestjs/swagger';

export class UserBasicEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User UUID' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;
}

export class RoleBasicEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'Role UUID' })
  id: string;

  @ApiProperty({ example: 'Admin', description: 'Role name' })
  name: string;
}

export class CityBasicEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'City UUID' })
  id: string;

  @ApiProperty({ example: 'Jakarta', description: 'City name' })
  name: string;
}

export class UserDetailEntity extends UserBasicEntity {
  @ApiProperty({ type: RoleBasicEntity, description: 'User role information' })
  role: RoleBasicEntity;

  @ApiProperty({ type: CityBasicEntity, description: 'User city information' })
  cities: CityBasicEntity;
}

export class InstitusiEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003', description: 'Institution UUID' })
  id: string;

  @ApiProperty({ example: 'Universitas Indonesia', description: 'Institution name' })
  name: string;

  @ApiProperty({ example: '2024-01-15T08:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T10:15:00.000Z', nullable: true, description: 'Last update timestamp' })
  updatedAt: Date | null;

  @ApiProperty({ example: null, nullable: true, description: 'Deletion timestamp (soft delete)' })
  deletedAt: Date | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004', description: 'ID of user who last updated' })
  updatedBy: string;
}

export class InstitusiWithUsersEntity extends InstitusiEntity {
  @ApiProperty({ 
    type: [UserDetailEntity], 
    description: 'List of users belonging to this institution',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'John Doe',
        email: 'john.doe@ui.ac.id',
        role: {
          id: '550e8400-e29b-41d4-a716-446655440006',
          name: 'Admin'
        },
        cities: {
          id: '550e8400-e29b-41d4-a716-446655440007',
          name: 'Jakarta'
        }
      }
    ]
  })
  users: UserDetailEntity[];
}
