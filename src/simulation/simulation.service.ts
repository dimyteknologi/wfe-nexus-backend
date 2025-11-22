import { Injectable } from '@nestjs/common';
import * as Projections from './utils/projections';
import * as ProcessingData from './utils/processing-data';
import { IApiData, IBaselineData, Params } from './types/response';
import { SimulationState } from './types/simulation-state';

@Injectable()
export class SimulationService {
  
  // Projections
  generateScenarioProjection(historicalData: IApiData, simulationState: SimulationState, finalYear?: number) {
    return Projections.generateScenarioProjection(historicalData, simulationState, finalYear);
  }

  generateBaseline(baseData: IApiData, finalYear?: number) {
    return Projections.generateBaseline(baseData, finalYear);
  }

  generateAllProjectionsForScenario(
    allBaselines: {
      gdp: IBaselineData;
      population: IBaselineData;
      agriculture: IBaselineData;
      landCover: IBaselineData;
    },
    inputs: SimulationState,
  ) {
    return Projections.generateAllProjectionsForScenario(allBaselines, inputs);
  }

  generateApAreaProjection(param: Params, inputs: SimulationState, startYear?: number, finalYear?: number) {
    return Projections.generateApAreaProjection(param, inputs, startYear, finalYear);
  }

  generatePvAreaProjection(name: string, inputs: SimulationState, startYear?: number, finalYear?: number) {
    return Projections.generatePvAreaProjection(name, inputs, startYear, finalYear);
  }

  generateLandCover(startYear: number, endYear: number) {
    return Projections.generateLandCover(startYear, endYear);
  }

  generateLandPortion(landCoverData: IApiData) {
    return Projections.generateLandPortion(landCoverData);
  }

  // Processing Data - Water
  generateDomesticWaterDemand(data: number[]) {
    return ProcessingData.generateDomesticWaterDemandProcess(data);
  }

  generateIndustrialWaterDemand(data: number[]) {
    return ProcessingData.generateIndustrialWaterDemandProcess(data);
  }

  generateCropsLandWaterDemand(data: number[]) {
    return ProcessingData.generateCropsLandWaterDemandProcess(data);
  }

  generateAquacultureWaterDemand(data: number[]) {
    return ProcessingData.generateAquacultureWaterDemandProcess(data);
  }

  generateMunicipalityWaterDemand(data: number[]) {
    return ProcessingData.generateMunicipalityWaterDemandProcess(data);
  }

  generateLivestockWaterDemand(dataCattle: number[], dataGoat: number[], dataPoultry: number[]) {
    return ProcessingData.generateLivestockWaterDemandProcess(dataCattle, dataGoat, dataPoultry);
  }

  // Processing Data - Energy
  generateDomesticEnergyDemand(data: number[]) {
    return ProcessingData.generateDomesticEnergyDemand(data);
  }

  generateIndustrialEnergyDemand(data: number[]) {
    return ProcessingData.generateIndustrialEnergyDemand(data);
  }

  generateAgricultureEnergyDemand(data: number[]) {
    return ProcessingData.generateAgricultureEnergyDemand(data);
  }

  generateWaterGenerationEnergyDemand(data: number[]) {
    return ProcessingData.generateWaterGenerationEnergyDemand(data);
  }

  // Processing Data - Food
  generateFoodDemand(data: number[]) {
    return ProcessingData.generateFoodDemand(data);
  }

  generateDomesticFoodDemand(data: number[]) {
    return ProcessingData.generateDomesticFoodDemand(data);
  }

  // Processing Data - Other
  generateCValue(dataIndustrial: number[], dataHousing: number[], dataForest: number[], dataAgriculture: number[], dataOtherLand: number[]) {
    return Projections.generateCValue(dataIndustrial, dataHousing, dataForest, dataAgriculture, dataOtherLand);
  }
  
  generatePotentialWater(data: number[]) {
    return ProcessingData.generatePotentialWater(data);
  }

  generateTotalWater(dataWaterSupply: number[], dataApWaterIndustrial: number[], dataApWaterHousing: number[]) {
    return ProcessingData.generateTotalWater(dataWaterSupply, dataApWaterIndustrial, dataApWaterHousing);
  }

  generateApWater(data: number[]) {
    return ProcessingData.generateApWater(data);
  }

  generateEnergySupply(dataTotalEnergyDemand: number[], dataAvailabilityFactor: number[]) {
    return ProcessingData.generateEnergySupply(dataTotalEnergyDemand, dataAvailabilityFactor);
  }
}
