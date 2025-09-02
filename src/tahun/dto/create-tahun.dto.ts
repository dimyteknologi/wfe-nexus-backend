import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTahunDto {
  @ApiProperty({
    example: 2025,
    description: 'Year value',
  })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
    description: 'UUID of the city',
  })
  @IsUUID()
  @IsNotEmpty()
  cityId: string;
}