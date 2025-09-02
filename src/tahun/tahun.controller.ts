import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TahunService } from './tahun.service';
import { CreateTahunDto } from './dto/create-tahun.dto';
import { UpdateTahunDto } from './dto/update-tahun.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tahun')
@Controller('tahun')
export class TahunController {
  constructor(private readonly tahunService: TahunService) {}

  @Post()
  @ApiOperation({ summary: 'Create new year record' })
  @ApiResponse({ status: 201, description: 'Year record created successfully' })
  create(@Body() createTahunDto: CreateTahunDto) {
    return this.tahunService.create(createTahunDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all year records' })
  @ApiResponse({ status: 200, description: 'All year records retrieved successfully' })
  findAll() {
    return this.tahunService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get year record by ID' })
  @ApiResponse({ status: 200, description: 'Year record retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.tahunService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update year record' })
  @ApiResponse({ status: 200, description: 'Year record updated successfully' })
  update(@Param('id') id: string, @Body() updateTahunDto: UpdateTahunDto) {
    return this.tahunService.update(id, updateTahunDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete year record' })
  @ApiResponse({ status: 200, description: 'Year record deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tahunService.remove(id);
  }
}
