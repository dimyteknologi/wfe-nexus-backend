import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstitusiDto {
  @ApiProperty({
    description: 'Nama institusi',
    example: 'Universitas Indonesia'
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;
}
