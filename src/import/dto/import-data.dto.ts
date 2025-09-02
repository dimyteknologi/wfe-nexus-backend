import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportDataRowDto {
  @ApiProperty({
    description: 'Data year',
    example: 2024
  })
  @IsNumber()
  tahun: number;

  @ApiProperty({
    description: 'Data category (population, gdrp, agriculture, livestock, fisheries)',
    example: 'populasi'
  })
  @IsString()
  kategori: string;

  @ApiProperty({
    description: 'Specific parameter according to category',
    example: 'laki_laki'
  })
  @IsString()
  parameter: string;

  @ApiProperty({
    description: 'Data value',
    example: 1000000
  })
  @IsNumber()
  nilai: number;
}

export class ImportResultDto {
  @ApiProperty({
    description: 'Status import',
    example: 'success'
  })
  status: string;

  @ApiProperty({
    description: 'Number of rows imported successfully',
    example: 150
  })
  imported: number;

  @ApiProperty({
    description: 'Number of rows that failed to import',
    example: 5
  })
  failed: number;

  @ApiProperty({
    description: 'Error details if any',
    example: []
  })
  errors: string[];

  @ApiProperty({
    description: 'Additional message',
    example: 'Data imported successfully'
  })
  message: string;
}
