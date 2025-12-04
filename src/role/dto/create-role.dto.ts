import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Manager', description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [String],
    example: [
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    ],
    description: 'An array of permission UUIDs to assign to the role',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}