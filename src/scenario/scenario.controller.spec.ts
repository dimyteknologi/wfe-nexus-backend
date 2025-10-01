import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioController } from './scenario.controller';
import { ScenarioService } from './scenario.service';

describe('ScenarioController', () => {
  let controller: ScenarioController;
  let service: ScenarioService;

  const mockScenarioService = {
    create: jest.fn(),
    findAllByCity: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenarioController],
      providers: [
        {
          provide: ScenarioService,
          useValue: mockScenarioService,
        },
      ],
    }).compile();

    controller = module.get<ScenarioController>(ScenarioController);
    service = module.get<ScenarioService>(ScenarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a scenario with configurations', async () => {
      const createDto = {
        simulationName: 'Test Simulation',
        agriculture: {
          growthScenario: {
            '2025-2030': 1.5,
            '2031-2040': 2.0,
            '2041-2045': 2.5
          }
        },
        livestock: {
          cattleGrowth: {
            '2025-2030': 1.0,
            '2031-2040': 1.5,
            '2041-2045': 2.0
          }
        },
        energy: {
          solarPvCoverage: {
            '2025-2030': 10,
            '2031-2040': 20,
            '2041-2045': 30
          }
        },
        industry: {
          growth: {
            '2025-2030': 3.0,
            '2031-2040': 4.0,
            '2041-2045': 5.0
          }
        },
        water: {
          domesticWaterDemand: {
            '2025-2030': 100,
            '2031-2040': 120,
            '2041-2045': 140
          }
        },
        demography: {
          populationGrowth: {
            '2025-2030': 1.2,
            '2031-2040': 1.0,
            '2041-2045': 0.8
          }
        }
      };
      const req = { user: { userId: 'user-1', cityId: 'city-1' } };
      const expectedResult = {
        id: 'scenario-1',
        simulationName: 'Test Simulation',
        userId: 'user-1',
        cityId: 'city-1',
        cityName: 'Test City',
        userName: 'Test User',
        agriculture: {
          growthScenario: { '2025-2030': 1.5, '2031-2040': 2.0, '2041-2045': 2.5 },
          landConversion: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          aquacultureLandGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          productivityTarget: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
        },
        livestock: {
          cattleGrowth: { '2025-2030': 1.0, '2031-2040': 1.5, '2041-2045': 2.0 },
          poultryGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          goatGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
        },
        energy: {
          solarPvCoverage: { '2025-2030': 10, '2031-2040': 20, '2041-2045': 30 },
          solarPvAreaIndustrial: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          solarPvAreaHousing: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          onGrid: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          offGrid: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          electricitySupply: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          electricityDemand: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          industrialEnergy: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          domesticElectricity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
        },
        industry: {
          growth: { '2025-2030': 3.0, '2031-2040': 4.0, '2041-2045': 5.0 }
        },
        water: {
          artificialPondIndustrial: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          artificialPondHousing: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          groundWaterCapacity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          surfaceWaterCapacity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
          domesticWaterDemand: { '2025-2030': 100, '2031-2040': 120, '2041-2045': 140 },
          industrialWater: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
        },
        demography: {
          populationGrowth: { '2025-2030': 1.2, '2031-2040': 1.0, '2041-2045': 0.8 }
        },
        createdAt: new Date(),
        updatedAt: null,
        updatedBy: 'user-1',
      };

      mockScenarioService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto as any, req);

      expect(service.create).toHaveBeenCalledWith(createDto, 'user-1', 'city-1');
      expect(result).toEqual(expectedResult);
    });
  });



  describe('findAll', () => {
    it('should return scenarios with configurations for user city', async () => {
      const req = { user: { cityId: 'city-1' } };
      const expectedResult = {
        data: [
          {
            id: 'scenario-1',
            simulationName: 'Test Scenario',
            userId: 'user-1',
            cityId: 'city-1',
            cityName: 'Test City',
            userName: 'Test User',
            agriculture: {
              growthScenario: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              landConversion: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              aquacultureLandGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              productivityTarget: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            livestock: {
              cattleGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              poultryGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              goatGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            energy: {
              solarPvCoverage: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              solarPvAreaIndustrial: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              solarPvAreaHousing: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              onGrid: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              offGrid: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              electricitySupply: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              electricityDemand: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              industrialEnergy: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              domesticElectricity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            industry: {
              growth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            water: {
              artificialPondIndustrial: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              artificialPondHousing: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              groundWaterCapacity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              surfaceWaterCapacity: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              domesticWaterDemand: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 },
              industrialWater: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            demography: {
              populationGrowth: { '2025-2030': 0, '2031-2040': 0, '2041-2045': 0 }
            },
            createdAt: new Date(),
            updatedAt: null,
            updatedBy: 'user-1'
          }
        ],
        total: 1,
        message: 'Scenarios with configurations retrieved successfully'
      };

      mockScenarioService.findAllByCity.mockResolvedValue(expectedResult);

      const result = await controller.findAll(req);

      expect(service.findAllByCity).toHaveBeenCalledWith('city-1');
      expect(result).toEqual(expectedResult);
      expect(result.data[0].agriculture).toBeDefined();
      expect(result.data[0].livestock).toBeDefined();
    });
  });





  describe('remove', () => {
    it('should delete a scenario', async () => {
      const req = { user: { userId: 'user-1', cityId: 'city-1' } };
      const scenarioId = 'scenario-1';
      const expectedResult = { message: 'Scenario deleted successfully' };

      mockScenarioService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(scenarioId, req);

      expect(service.remove).toHaveBeenCalledWith(scenarioId, 'user-1', 'city-1');
      expect(result).toEqual(expectedResult);
    });
  });
});