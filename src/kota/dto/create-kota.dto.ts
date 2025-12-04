import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKotaDto {
  @ApiProperty({
    example: 'Bandung',
    description: 'The name of the city',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}