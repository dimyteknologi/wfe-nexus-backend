import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimePeriodDataDto {
  @ApiProperty({ nullable: true, type: Number })
  '2025-2030': number | null;

  @ApiProperty({ nullable: true, type: Number })
  '2031-2040': number | null;

  @ApiProperty({ nullable: true, type: Number })
  '2041-2045': number | null;
}

export class AgricultureStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  growthScenario: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  landConversion: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  aquacultureLandGrowth: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  productivityTarget: TimePeriodDataDto;
}

export class LivestockStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  cattleGrowth: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  poultryGrowth: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  goatGrowth: TimePeriodDataDto;
}

export class EnergyStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  solarPvCoverage: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  solarPvAreaIndustrial: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  solarPvAreaHousing: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  onGrid: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  offGrid: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  electricitySupply: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  electricityDemand: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  industrialEnergy: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  domesticElectricity: TimePeriodDataDto;
}

export class IndustryStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  growth: TimePeriodDataDto;
}

export class WaterStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  artificialPondIndustrial: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  artificialPondHousing: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  surfaceWaterCapacity: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  groundWaterCapacity: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  domesticWaterDemand: TimePeriodDataDto;

  @ApiProperty({ type: TimePeriodDataDto })
  industrialWater: TimePeriodDataDto;
}

export class DemographyStateDto {
  @ApiProperty({ type: TimePeriodDataDto })
  populationGrowth: TimePeriodDataDto;
}

export class SimulationStateDto {
  @ApiProperty({ nullable: true, type: String })
  simulationName: string | null;

  @ApiProperty({ nullable: true, type: String })
  scenario_a: string | null;

  @ApiProperty({ nullable: true, type: String })
  scenario_b: string | null;

  @ApiProperty({ type: AgricultureStateDto })
  agriculture: AgricultureStateDto;

  @ApiProperty({ type: LivestockStateDto })
  livestock: LivestockStateDto;

  @ApiProperty({ type: EnergyStateDto })
  energy: EnergyStateDto;

  @ApiProperty({ type: IndustryStateDto })
  industry: IndustryStateDto;

  @ApiProperty({ type: WaterStateDto })
  water: WaterStateDto;

  @ApiProperty({ type: DemographyStateDto })
  demography: DemographyStateDto;
}

export class ParamsDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  average: number;

  @ApiProperty({ type: [Number], nullable: true })
  growth: (number | null)[];

  @ApiProperty({ type: [Number], nullable: true })
  values: (number | null)[];
}

export class ApiDataParamsDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [Number], nullable: true })
  values: (number | null)[];
}

export class ApiDataDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ type: [Number] })
  years: number[];

  @ApiProperty({ type: [ApiDataParamsDto] })
  parameters: ApiDataParamsDto[];
}

export class BaselineDataDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ type: [Number] })
  years: number[];

  @ApiProperty({ type: [ParamsDto] })
  parameters: ParamsDto[];
}

export class GenerateScenarioProjectionDto {
  @ApiProperty({ type: ApiDataDto })
  historicalData: ApiDataDto;

  @ApiProperty({ type: SimulationStateDto })
  simulationState: SimulationStateDto;

  @ApiPropertyOptional()
  finalYear?: number;
}

export class GenerateBaselineDto {
  @ApiProperty({ type: ApiDataDto })
  baseData: ApiDataDto;

  @ApiPropertyOptional()
  finalYear?: number;
}

export class AllBaselinesDto {
  @ApiProperty({ type: BaselineDataDto })
  gdp: BaselineDataDto;

  @ApiProperty({ type: BaselineDataDto })
  population: BaselineDataDto;

  @ApiProperty({ type: BaselineDataDto })
  agriculture: BaselineDataDto;

  @ApiProperty({ type: BaselineDataDto })
  landCover: BaselineDataDto;
}

export class GenerateAllProjectionsDto {
  @ApiProperty({ type: AllBaselinesDto })
  allBaselines: AllBaselinesDto;

  @ApiProperty({ type: SimulationStateDto })
  inputs: SimulationStateDto;
}

export class GenerateApAreaProjectionDto {
  @ApiProperty({ type: ParamsDto })
  param: ParamsDto;

  @ApiProperty({ type: SimulationStateDto })
  inputs: SimulationStateDto;

  @ApiPropertyOptional()
  startYear?: number;

  @ApiPropertyOptional()
  finalYear?: number;
}

export class GeneratePvAreaProjectionDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: SimulationStateDto })
  inputs: SimulationStateDto;

  @ApiPropertyOptional()
  startYear?: number;

  @ApiPropertyOptional()
  finalYear?: number;
}

export class GenerateLandPortionDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ type: [Number] })
  years: number[];

  @ApiProperty({ type: [ApiDataParamsDto] })
  parameters: ApiDataParamsDto[];
}
