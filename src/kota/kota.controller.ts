import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { KotaService } from './kota.service';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { CreateKotaDto } from './dto/create-kota.dto';
import { UpdateKotaDto } from './dto/update-kota.dto';

@ApiTags('Kota Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('kota')
export class KotaController {
    constructor(private readonly kotaService: KotaService) {}

    @Post()
    @Permissions('manage:kota')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new city (kota)' })
    @ApiResponse({ status: 201, description: 'City created successfully.' })
    create(@Body() createKotaDto: CreateKotaDto) {
        return this.kotaService.create(createKotaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all cities (kota)' })
    findAll() {
        return this.kotaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single city by ID' })
    findOne(@Param('id') id: string) {
        return this.kotaService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage:kota')
    @ApiOperation({ summary: 'Update a city' })
    update(@Param('id') id: string, @Body() updateKotaDto: UpdateKotaDto) {
        return this.kotaService.update(id, updateKotaDto);
    }

    @Delete(':id')
    @Permissions('manage:kota')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a city' })
    remove(@Param('id') id: string) {
        return this.kotaService.remove(id);
    }
}
