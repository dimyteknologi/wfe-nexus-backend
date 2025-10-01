import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class PeriodValuesDto {
  @ApiProperty({ example: 0 })
  '2025-2030': number;

  @ApiProperty({ example: 0 })
  '2031-2040': number;

  @ApiProperty({ example: 0 })
  '2041-2045': number;
}

class AgricultureDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  growthScenario: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  landConversion: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  aquacultureLandGrowth: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  productivityTarget: PeriodValuesDto;
}

class LivestockDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  cattleGrowth: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  poultryGrowth: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  goatGrowth: PeriodValuesDto;
}

class EnergyDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  solarPvCoverage: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  solarPvAreaIndustrial: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  solarPvAreaHousing: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  onGrid: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  offGrid: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  electricitySupply: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  electricityDemand: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  industrialEnergy: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  domesticElectricity: PeriodValuesDto;
}

class IndustryDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  growth: PeriodValuesDto;
}

class WaterDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  artificialPondIndustrial: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  artificialPondHousing: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  groundWaterCapacity: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  surfaceWaterCapacity: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  domesticWaterDemand: PeriodValuesDto;

  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  industrialWater: PeriodValuesDto;
}

class DemographyDto {
  @ApiProperty({ type: PeriodValuesDto })
  @ValidateNested()
  @Type(() => PeriodValuesDto)
  populationGrowth: PeriodValuesDto;
}

export class CreateScenarioDto {
  @ApiProperty({ 
    description: 'Nama simulasi skenario', 
    example: 'Skenario Baseline 2025-2045',
    nullable: true 
  })
  @IsOptional()
  @IsString()
  simulationName?: string;

  @ApiProperty({ type: AgricultureDto })
  @ValidateNested()
  @Type(() => AgricultureDto)
  agriculture: AgricultureDto;

  @ApiProperty({ type: LivestockDto })
  @ValidateNested()
  @Type(() => LivestockDto)
  livestock: LivestockDto;

  @ApiProperty({ type: EnergyDto })
  @ValidateNested()
  @Type(() => EnergyDto)
  energy: EnergyDto;

  @ApiProperty({ type: IndustryDto })
  @ValidateNested()
  @Type(() => IndustryDto)
  industry: IndustryDto;

  @ApiProperty({ type: WaterDto })
  @ValidateNested()
  @Type(() => WaterDto)
  water: WaterDto;

  @ApiProperty({ type: DemographyDto })
  @ValidateNested()
  @Type(() => DemographyDto)
  demography: DemographyDto;
}