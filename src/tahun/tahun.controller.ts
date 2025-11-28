import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TahunService } from './tahun.service';
import { CreateTahunDto } from './dto/create-tahun.dto';
import { UpdateTahunDto } from './dto/update-tahun.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@ApiTags('tahun')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tahun')
export class TahunController {
  constructor(private readonly tahunService: TahunService) { }

  @Post()
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Create new year record' })
  @ApiResponse({ status: 201, description: 'Year record created successfully' })
  create(@Body() createTahunDto: CreateTahunDto) {
    return this.tahunService.create(createTahunDto);
  }

  @Get()
  @Permissions('read:data')
  @ApiOperation({ summary: 'Get all year records' })
  @ApiResponse({ status: 200, description: 'All year records retrieved successfully' })
  findAll() {
    return this.tahunService.findAll();
  }

  @Get(':id')
  @Permissions('read:data')
  @ApiOperation({ summary: 'Get year record by ID' })
  @ApiResponse({ status: 200, description: 'Year record retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.tahunService.findOne(id);
  }

  @Patch(':id')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Update year record' })
  @ApiResponse({ status: 200, description: 'Year record updated successfully' })
  update(@Param('id') id: string, @Body() updateTahunDto: UpdateTahunDto) {
    return this.tahunService.update(id, updateTahunDto);
  }

  @Delete(':id')
  @Permissions('manage:data')
  @ApiOperation({ summary: 'Delete year record' })
  @ApiResponse({ status: 200, description: 'Year record deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tahunService.remove(id);
  }
}
