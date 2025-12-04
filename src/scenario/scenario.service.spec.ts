import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioService } from './scenario.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ScenarioService', () => {
  let service: ScenarioService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    scenario: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    scenarioConfiguration: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ScenarioService>(ScenarioService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      
      const mockCreatedScenario = {
        id: 'scenario-1',
        name: 'Test Simulation',
        userId: 'user-1',
        cityId: 'city-1',
        user: { name: 'Test User' },
        city: { name: 'Test City' }
      };

      const mockScenarioWithConfigs = {
        ...mockCreatedScenario,
        createdAt: new Date(),
        updatedAt: null,
        updatedBy: 'user-1',
        configurations: [
          {
            id: 'config-1',
            category: 'agriculture',
            subType: 'growthScenario',
            period: '2025-2030',
            value: 1.5,
            createdAt: new Date(),
            updatedAt: null
          }
        ]
      };

      mockPrismaService.scenario.create.mockResolvedValue(mockCreatedScenario);
      mockPrismaService.scenarioConfiguration.createMany.mockResolvedValue({});
      mockPrismaService.scenario.findUnique.mockResolvedValue(mockScenarioWithConfigs);

      const result = await service.create(createDto as any, 'user-1', 'city-1');

      expect(result.simulationName).toBe('Test Simulation');
      expect(result.agriculture).toBeDefined();
      expect(result.agriculture.growthScenario['2025-2030']).toBe(1.5);
      expect(mockPrismaService.scenario.create).toHaveBeenCalled();
      expect(mockPrismaService.scenarioConfiguration.createMany).toHaveBeenCalled();
    });
  });



  describe('findAllByCity', () => {
    it('should return scenarios with configurations by city', async () => {
      const cityId = 'city-1';
      const mockScenarios = [
        {
          id: 'scenario-1',
          name: 'Test Scenario 1',
          userId: 'user-1',
          cityId,
          createdAt: new Date(),
          updatedAt: null,
          updatedBy: 'user-1',
          user: { name: 'Test User 1' },
          city: { name: 'Test City' },
          configurations: [
            {
              id: 'config-1',
              category: 'demography',
              subType: 'populationGrowth',
              period: '2025-2030',
              value: 2.5,
              createdAt: new Date(),
              updatedAt: null
            }
          ]
        }
      ];

      mockPrismaService.scenario.findMany.mockResolvedValue(mockScenarios);

      const result = await service.findAllByCity(cityId);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].demography).toBeDefined();
      expect(result.data[0].demography.populationGrowth['2025-2030']).toBe(2.5);
      expect(result.total).toBe(1);
      expect(result.message).toBe('Scenarios with configurations retrieved successfully');
    });
  });





  describe('remove', () => {
    it('should soft delete a scenario when user is owner', async () => {
      const scenarioId = 'scenario-1';
      const userId = 'user-1';
      const cityId = 'city-1';

      const mockExistingScenario = {
        id: scenarioId,
        userId,
        cityId,
      };

      mockPrismaService.scenario.findFirst.mockResolvedValue(mockExistingScenario);
      mockPrismaService.scenario.update.mockResolvedValue({});

      const result = await service.remove(scenarioId, userId, cityId);

      expect(result.message).toBe('Scenario deleted successfully');
      expect(mockPrismaService.scenario.update).toHaveBeenCalledWith({
        where: { id: scenarioId },
        data: {
          deletedAt: expect.any(Date),
          updatedBy: userId,
        }
      });
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      const scenarioId = 'scenario-1';
      const userId = 'user-1';
      const ownerId = 'user-2';
      const cityId = 'city-1';

      const mockExistingScenario = {
        id: scenarioId,
        userId: ownerId,
        cityId,
      };

      mockPrismaService.scenario.findFirst.mockResolvedValue(mockExistingScenario);

      await expect(service.remove(scenarioId, userId, cityId)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});