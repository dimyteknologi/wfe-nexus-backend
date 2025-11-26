export type TimePeriod = "2025-2030" | "2031-2040" | "2041-2045";
export type TimePeriodData = Record<TimePeriod, number | null>;

export interface AgricultureState {
  growthScenario: TimePeriodData;
  landConversion: TimePeriodData;
  aquacultureLandGrowth: TimePeriodData;
  productivityTarget: TimePeriodData;
}

export interface LivestockState {
  cattleGrowth: TimePeriodData;
  poultryGrowth: TimePeriodData;
  goatGrowth: TimePeriodData;
}

export interface EnergyState {
  solarPvCoverage: TimePeriodData;
  solarPvAreaIndustrial: TimePeriodData;
  solarPvAreaHousing: TimePeriodData;
  onGrid: TimePeriodData;
  offGrid: TimePeriodData;
  electricitySupply: TimePeriodData;
  electricityDemand: TimePeriodData;
  industrialEnergy: TimePeriodData;
  domesticElectricity: TimePeriodData;
}

export interface IndustryState {
  growth: TimePeriodData;
}

export interface WaterState {
  artificialPondIndustrial: TimePeriodData;
  artificialPondHousing: TimePeriodData;
  surfaceWaterCapacity: TimePeriodData;
  groundWaterCapacity: TimePeriodData;
  domesticWaterDemand: TimePeriodData;
  industrialWater: TimePeriodData;
}

export interface DemographyState {
  populationGrowth: TimePeriodData;
}

export interface SimulationState {
  simulationName: string | null;
  scenario_a: string | null;
  scenario_b: string | null;
  agriculture: AgricultureState;
  livestock: LivestockState;
  energy: EnergyState;
  industry: IndustryState;
  water: WaterState;
  demography: DemographyState;
}

export interface BaselinePayload {
  [key: string]: number;
}
