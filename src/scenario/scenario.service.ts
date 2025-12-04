import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { ScenarioResponseDto, ScenarioListResponseDto } from './dto/scenario-response.dto';

@Injectable()
export class ScenarioService {
  constructor(private prisma: PrismaService) {}

  async create(createScenarioDto: CreateScenarioDto, userId: string, cityId: string): Promise<ScenarioResponseDto> {
    // Create scenario first
    const scenario = await this.prisma.scenario.create({
      data: {
        name: createScenarioDto.simulationName || 'Untitled Scenario',
        userId,
        cityId,
        updatedBy: userId,
      },
      include: {
        user: { select: { name: true } },
        city: { select: { name: true } }
      }
    });

    // Process and create configurations
    const configurations = this.processConfigurationData(createScenarioDto, scenario.id);
    
    if (configurations.length > 0) {
      await this.prisma.scenarioConfiguration.createMany({
        data: configurations
      });
    }

    // Fetch the created scenario with configurations
    const scenarioWithConfigs = await this.prisma.scenario.findUnique({
      where: { id: scenario.id },
      include: {
        user: { select: { name: true } },
        city: { select: { name: true } },
        configurations: {
          select: {
            id: true,
            category: true,
            subType: true,
            period: true,
            value: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!scenarioWithConfigs) {
      throw new NotFoundException('Failed to retrieve created scenario');
    }

    const nestedConfigurations = this.transformConfigurationsToNestedFormat(scenarioWithConfigs.configurations);

    return {
      id: scenarioWithConfigs.id,
      simulationName: scenarioWithConfigs.name,
      userId: scenarioWithConfigs.userId,
      cityId: scenarioWithConfigs.cityId,
      cityName: scenarioWithConfigs.city.name,
      userName: scenarioWithConfigs.user.name,
      createdAt: scenarioWithConfigs.createdAt,
      updatedAt: scenarioWithConfigs.updatedAt,
      updatedBy: scenarioWithConfigs.updatedBy,
      ...nestedConfigurations
    };
  }

  private processConfigurationData(dto: CreateScenarioDto, scenarioId: string) {
    const configurations: Array<{
      scenarioId: string;
      category: string;
      subType: string;
      period: string;
      value: number;
    }> = [];

    // Process agriculture configurations
    Object.entries(dto.agriculture).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'agriculture',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    // Process livestock configurations
    Object.entries(dto.livestock).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'livestock',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    // Process energy configurations
    Object.entries(dto.energy).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'energy',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    // Process industry configurations
    Object.entries(dto.industry).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'industry',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    // Process water configurations
    Object.entries(dto.water).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'water',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    // Process demography configurations
    Object.entries(dto.demography).forEach(([subType, periodData]) => {
      Object.entries(periodData as any).forEach(([period, value]) => {
        configurations.push({
          scenarioId,
          category: 'demography',
          subType,
          period,
          value: Number(value)
        });
      });
    });

    return configurations;
  }

  private transformConfigurationsToNestedFormat(configurations: any[]) {
    const result: any = {};

    // Group configurations by category and subType
    configurations.forEach(config => {
      const category = config.category;
      const subType = config.subType;
      const period = config.period;
      const value = config.value;

      // Initialize category if it doesn't exist
      if (!result[category]) {
        result[category] = {};
      }

      // Initialize subType if it doesn't exist
      if (!result[category][subType]) {
        result[category][subType] = {};
      }

      // Set the value for this period
      result[category][subType][period] = value;
    });

    return result;
  }



  async findAllByCity(cityId: string): Promise<ScenarioListResponseDto> {
    const scenarios = await this.prisma.scenario.findMany({
      where: { 
        cityId,
        deletedAt: null 
      },
      include: {
        user: { select: { name: true } },
        city: { select: { name: true } },
        configurations: {
          select: {
            id: true,
            category: true,
            subType: true,
            period: true,
            value: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const data = scenarios.map(scenario => {
      const nestedConfigurations = this.transformConfigurationsToNestedFormat(scenario.configurations);
      
      return {
        id: scenario.id,
        simulationName: scenario.name,
        ...nestedConfigurations
      };
    });

    return {
      data,
      total: data.length,
      message: 'Scenarios with configurations retrieved successfully'
    };
  }



  async remove(id: string, userId: string, cityId: string): Promise<{ message: string }> {
    const existingScenario = await this.prisma.scenario.findFirst({
      where: { 
        id,
        cityId,
        deletedAt: null 
      }
    });

    if (!existingScenario) {
      throw new NotFoundException('Scenario not found');
    }

    // Check if user can delete (either owner or admin)
    if (existingScenario.userId !== userId) {
      throw new ForbiddenException('You can only delete your own scenarios');
    }

    await this.prisma.scenario.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
      }
    });

    return { message: 'Scenario deleted successfully' };
  }
}