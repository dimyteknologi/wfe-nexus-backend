import { Body, Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';
import {
  GenerateScenarioProjectionDto,
  GenerateBaselineDto,
  GenerateAllProjectionsDto,
  GenerateApAreaProjectionDto,
  GeneratePvAreaProjectionDto,
  ApiDataDto,
  BaselineDataDto,
} from './dto/simulation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@ApiTags('Simulation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) { }

  @Post('projection/scenario')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate scenario projection' })
  @ApiResponse({ status: 201, description: 'Scenario projection generated', type: BaselineDataDto })
  generateScenarioProjection(@Body() dto: GenerateScenarioProjectionDto) {
    return this.simulationService.generateScenarioProjection(
      dto.historicalData,
      dto.simulationState,
      dto.finalYear,
    );
  }

  @Post('projection/baseline')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate baseline projection' })
  @ApiResponse({ status: 201, description: 'Baseline projection generated', type: BaselineDataDto })
  generateBaseline(@Body() dto: GenerateBaselineDto) {
    return this.simulationService.generateBaseline(dto.baseData, dto.finalYear);
  }

  @Post('projection/all')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate all projections for scenario' })
  @ApiResponse({ status: 201, description: 'All projections generated' })
  generateAllProjectionsForScenario(@Body() dto: GenerateAllProjectionsDto) {
    return this.simulationService.generateAllProjectionsForScenario(
      dto.allBaselines,
      dto.inputs,
    );
  }

  @Post('projection/ap-area')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate AP Area projection' })
  @ApiResponse({ status: 201, description: 'AP Area projection generated', type: [Number] })
  generateApAreaProjection(@Body() dto: GenerateApAreaProjectionDto) {
    return this.simulationService.generateApAreaProjection(
      dto.param,
      dto.inputs,
      dto.startYear,
      dto.finalYear,
    );
  }

  @Post('projection/pv-area')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate PV Area projection' })
  @ApiResponse({ status: 201, description: 'PV Area projection generated', type: [Number] })
  generatePvAreaProjection(@Body() dto: GeneratePvAreaProjectionDto) {
    return this.simulationService.generatePvAreaProjection(
      dto.name,
      dto.inputs,
      dto.startYear,
      dto.finalYear,
    );
  }

  @Get('land-cover')
  @Permissions('read:data')
  @ApiOperation({ summary: 'Generate Land Cover data' })
  @ApiQuery({ name: 'startYear', required: true, type: Number })
  @ApiQuery({ name: 'endYear', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Land Cover data generated', type: ApiDataDto })
  generateLandCover(
    @Query('startYear') startYear: number,
    @Query('endYear') endYear: number,
  ) {
    return this.simulationService.generateLandCover(
      Number(startYear),
      Number(endYear),
    );
  }

  @Post('land-portion')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Generate Land Portion data' })
  @ApiResponse({ status: 201, description: 'Land Portion data generated', type: ApiDataDto })
  generateLandPortion(@Body() landCoverData: ApiDataDto) {
    return this.simulationService.generateLandPortion(landCoverData);
  }
}
