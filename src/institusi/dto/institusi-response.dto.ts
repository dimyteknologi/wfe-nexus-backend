import { ApiProperty } from '@nestjs/swagger';
import { InstitusiEntity } from '../entities/institusi.entity';

export class DeleteInstitusiResponseDto {
  @ApiProperty({ example: 'Institution deleted successfully' })
  message: string;

  @ApiProperty({ type: InstitusiEntity })
  institusi: InstitusiEntity;
}

export class CountInstitusiResponseDto {
  @ApiProperty({ example: 10, description: 'Total number of institutions' })
  total: number;
}
