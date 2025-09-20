import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException, 
  UseGuards,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportResultDto } from './dto/import-data.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
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
    description: 'CSV file to validate',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with .csv extension'
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
    description: 'Invalid file or wrong format' 
  })
  async validateCsv(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File must be in .csv format');
    }

    return this.importService.validateCsv(file);
  }

  @Post('csv')
  @Permissions('manage:data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Import data from CSV file',
    description: 'Upload CSV file with header format: year, category, parameter, value. Supported categories: population, gdrp, agriculture, livestock, fisheries. The data will be imported for the city associated with the authenticated user.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file to import',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with .csv extension'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data imported successfully', 
    type: ImportResultDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid file or wrong format' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'No permission to import data' 
  })
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File must be in .csv format');
    }

    const kotaId = req.user.cityId;
    const skenario = 'baseline'; // Default scenario

    if (!kotaId) {
      throw new BadRequestException('User cityId not found. Please ensure you are logged in with a valid user account.');
    }

    return this.importService.importFromCsv(file, kotaId, skenario);
  }
}
