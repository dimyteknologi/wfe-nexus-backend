import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportDataRowDto {
  @ApiProperty({
    description: 'Tahun data',
    example: 2024
  })
  @IsNumber()
  tahun: number;

  @ApiProperty({
    description: 'Kategori data (populasi, pdrb, pertanian, peternakan, perikanan)',
    example: 'populasi'
  })
  @IsString()
  kategori: string;

  @ApiProperty({
    description: 'Parameter spesifik sesuai kategori',
    example: 'laki_laki'
  })
  @IsString()
  parameter: string;

  @ApiProperty({
    description: 'Nilai data',
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
    description: 'Jumlah baris yang berhasil diimport',
    example: 150
  })
  imported: number;

  @ApiProperty({
    description: 'Jumlah baris yang gagal diimport',
    example: 5
  })
  failed: number;

  @ApiProperty({
    description: 'Detail error jika ada',
    example: []
  })
  errors: string[];

  @ApiProperty({
    description: 'Pesan tambahan',
    example: 'Data berhasil diimport'
  })
  message: string;
}
