import { ApiProperty } from '@nestjs/swagger';

export class KotaEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'City UUID' })
  id: string;

  @ApiProperty({ example: 'Jakarta', description: 'City name' })
  name: string;
}

export class DeleteKotaResponseDto {
  @ApiProperty({ example: 'Kota with Id 550e8400-e29b-41d4-a716-446655440000 has been successfully deleted.', description: 'Success message' })
  message: string;
}

export class CountKotaResponseDto {
  @ApiProperty({ example: 15, description: 'Total number of cities' })
  total: number;
}
