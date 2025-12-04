import { ApiProperty } from '@nestjs/swagger';

export class ScenarioResponseDto {
  @ApiProperty({ description: 'ID skenario' })
  id: string;

  @ApiProperty({ description: 'Nama simulasi skenario' })
  simulationName: string;

  [key: string]: any;
}

export class ScenarioListResponseDto {
  @ApiProperty({ type: [ScenarioResponseDto] })
  data: ScenarioResponseDto[];

  @ApiProperty({ description: 'Total data' })
  total: number;

  @ApiProperty({ description: 'Pesan response' })
  message: string;
}
