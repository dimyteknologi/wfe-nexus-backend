import { 
  Controller, 
  Get, 
  Post,
  Body,
  Param, 
  Delete, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScenarioService } from './scenario.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { ScenarioResponseDto, ScenarioListResponseDto } from './dto/scenario-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/roles.decorator';

@ApiTags('Scenario Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('scenario')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Post()
  @Permissions('manage:data')
  @ApiOperation({ 
    summary: 'Buat skenario simulasi baru',
    description: 'Membuat skenario simulasi baru dengan konfigurasi lengkap untuk kota user yang sedang login'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Skenario berhasil dibuat', 
    type: ScenarioResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  @ApiResponse({ status: 401, description: 'Tidak terauthorisasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki permission' })
  async create(
    @Body() createScenarioDto: CreateScenarioDto,
    @Req() req: any
  ): Promise<ScenarioResponseDto> {
    return this.scenarioService.create(
      createScenarioDto, 
      req.user.userId, 
      req.user.cityId
    );
  }



  @Get()
  @Permissions('read:data')
  @ApiOperation({ 
    summary: 'Dapatkan daftar skenario',
    description: 'Mengambil semua skenario dengan konfigurasi berdasarkan kota user yang sedang login'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Daftar skenario berhasil diambil', 
    type: ScenarioListResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Tidak terauthorisasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki permission' })
  async findAll(@Req() req: any): Promise<ScenarioListResponseDto> {
    return this.scenarioService.findAllByCity(req.user.cityId);
  }



  @Delete(':id')
  @Permissions('manage:data')
  @ApiOperation({ 
    summary: 'Hapus skenario',
    description: 'Menghapus skenario yang dimiliki user (soft delete)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Skenario berhasil dihapus'
  })
  @ApiResponse({ status: 404, description: 'Skenario tidak ditemukan' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki akses untuk menghapus skenario ini' })
  @ApiResponse({ status: 401, description: 'Tidak terauthorisasi' })
  async remove(
    @Param('id') id: string,
    @Req() req: any
  ): Promise<{ message: string }> {
    return this.scenarioService.remove(id, req.user.userId, req.user.cityId);
  }
}