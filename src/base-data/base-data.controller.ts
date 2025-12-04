import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { BaseDataService } from './base-data.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { BaseDataResponseDto } from './dto/base-data-response.dto';

@ApiTags('Base Data')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('base-data')
export class BaseDataController {
    constructor(private readonly baseDataService: BaseDataService) {}

    @Get('get-population')
    @Permissions('read:data')
    @ApiOperation({ summary: 'Get historical population data for the user\'s city' })
    @ApiResponse({ status: 200, description: 'Population data retrieved successfully.', type: BaseDataResponseDto })
    @ApiResponse({ status: 404, description: 'Data not found.' })
    getPopulation(@Req() req: any): Promise<BaseDataResponseDto> {
        const cityId = req.user.cityId;
        return this.baseDataService.getPopulationData(cityId);
    }

    @Get('get-pertanian')
    @Permissions('read:data')
    @ApiOperation({ summary: 'Get historical agriculture data for the user\'s city' })
    @ApiResponse({ status: 200, description: 'Agriculture data retrieved successfully.', type: BaseDataResponseDto })
    @ApiResponse({ status: 404, description: 'Data not found.' })
    getPertanian(@Req() req: any): Promise<BaseDataResponseDto> {
        const cityId = req.user.cityId;
        return this.baseDataService.getPertanianData(cityId);
    }
    
    @Get('get-peternakan')
    @Permissions('read:data')
    @ApiOperation({ summary: 'Get historical livestock data for the user\'s city' })
    @ApiResponse({ status: 200, description: 'Livestock data retrieved successfully.', type: BaseDataResponseDto })
    @ApiResponse({ status: 404, description: 'Data not found.' })
    getPeternakan(@Req() req: any): Promise<BaseDataResponseDto> {
        const cityId = req.user.cityId;
        return this.baseDataService.getPeternakanData(cityId);
    }
    
    @Get('get-perikanan')
    @Permissions('read:data')
    @ApiOperation({ summary: 'Get historical fisheries data for the user\'s city' })
    @ApiResponse({ status: 200, description: 'Fisheries data retrieved successfully.', type: BaseDataResponseDto })
    @ApiResponse({ status: 404, description: 'Data not found.' })
    getPerikanan(@Req() req: any): Promise<BaseDataResponseDto> {
        const cityId = req.user.cityId;
        return this.baseDataService.getPerikananData(cityId);
    }
    
    @Get('get-gdp')
    @Permissions('read:data')
    @ApiOperation({ summary: 'Get historical GDRP data for the user\'s city' })
    @ApiResponse({ status: 200, description: 'GDRP data retrieved successfully.', type: BaseDataResponseDto })
    @ApiResponse({ status: 404, description: 'Data not found.' })
    getGdp(@Req() req: any): Promise<BaseDataResponseDto> {
        const cityId = req.user.cityId;
        return this.baseDataService.getGdpData(cityId);
    }
}