import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { KotaService } from './kota.service';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { CreateKotaDto } from './dto/create-kota.dto';
import { UpdateKotaDto } from './dto/update-kota.dto';
import { KotaEntity, DeleteKotaResponseDto, CountKotaResponseDto } from './entities/kota.entity';

@ApiTags('Kota Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('kota')
export class KotaController {
    constructor(private readonly kotaService: KotaService) { }

    @Post()
    @Permissions('manage:kota')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new city (kota)' })
    @ApiBody({ type: CreateKotaDto })
    @ApiResponse({ status: 201, description: 'City created successfully.', type: KotaEntity })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    create(@Body() createKotaDto: CreateKotaDto) {
        return this.kotaService.create(createKotaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all cities (kota)' })
    @ApiResponse({ status: 200, description: 'Return all cities.', type: [KotaEntity] })
    findAll() {
        return this.kotaService.findAll();
    }

    @Get('total')
    @Permissions('manage:kota')
    @ApiOperation({ summary: 'Get total cities count' })
    @ApiResponse({ status: 200, description: 'Return total count of cities.', type: CountKotaResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    count() {
        return this.kotaService.count();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single city by ID' })
    @ApiResponse({ status: 200, description: 'Return the city.', type: KotaEntity })
    @ApiResponse({ status: 404, description: 'City not found.' })
    findOne(@Param('id') id: string) {
        return this.kotaService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage:kota')
    @ApiOperation({ summary: 'Update a city' })
    @ApiBody({ type: UpdateKotaDto })
    @ApiResponse({ status: 200, description: 'City updated successfully.', type: KotaEntity })
    @ApiResponse({ status: 404, description: 'City not found.' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    update(@Param('id') id: string, @Body() updateKotaDto: UpdateKotaDto) {
        return this.kotaService.update(id, updateKotaDto);
    }

    @Delete(':id')
    @Permissions('manage:kota')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a city' })
    @ApiResponse({ status: 200, description: 'City deleted successfully.', type: DeleteKotaResponseDto })
    @ApiResponse({ status: 404, description: 'City not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
    remove(@Param('id') id: string) {
        return this.kotaService.remove(id);
    }
}
