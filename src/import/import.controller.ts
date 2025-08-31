import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException, 
  UseGuards,
  Req,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportResultDto } from './dto/import-data.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('validate')
  @Permissions('manage:data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Validasi file CSV sebelum import',
    description: 'Melakukan validasi format dan struktur file CSV tanpa melakukan import data'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File CSV untuk divalidasi',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File CSV dengan ekstensi .csv'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Hasil validasi file CSV' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'File tidak valid atau format salah' 
  })
  async validateCsv(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File harus berformat .csv');
    }

    return this.importService.validateCsv(file);
  }

  @Post('csv')
  @Permissions('manage:data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Import data dari file CSV',
    description: 'Upload file CSV dengan format header: tahun, kategori, parameter, nilai. Kategori yang didukung: populasi, pdrb, pertanian, peternakan, perikanan'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File CSV untuk diimport',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File CSV dengan ekstensi .csv'
        }
      }
    }
  })
  @ApiQuery({ 
    name: 'kotaId', 
    required: true, 
    description: 'ID kota tujuan import data',
    type: 'string'
  })
  @ApiQuery({ 
    name: 'skenario', 
    required: false, 
    description: 'Skenario data (default: baseline)',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data berhasil diimport', 
    type: ImportResultDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'File tidak valid atau format salah' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Tidak memiliki permission untuk mengimport data' 
  })
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Query('kotaId') kotaId: string,
    @Query('skenario') skenario: string = 'baseline',
    @Req() req: any
  ): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    if (!kotaId) {
      throw new BadRequestException('Parameter kotaId wajib diisi');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File harus berformat .csv');
    }

    return this.importService.importFromCsv(file, kotaId, skenario);
  }
}
