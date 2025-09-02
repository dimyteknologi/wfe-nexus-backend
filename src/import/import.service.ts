import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { ImportDataRowDto, ImportResultDto } from './dto/import-data.dto';
import { CsvValidator } from './csv-validator';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async validateCsv(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = new ExcelJS.Workbook();
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      await workbook.csv.read(stream);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        return {
          isValid: false,
          errors: ['CSV file is empty or invalid'],
          summary: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0
          }
        };
      }

      const csvData: any[][] = [];
      worksheet.eachRow((row, rowNumber) => {
        const values = row.values as any[];
        csvData.push(values.slice(1));
      });

      const validationResult = CsvValidator.validateCsvData(csvData);

      return {
        isValid: validationResult.isValid,
        errors: validationResult.errors.map(err => `Row ${err.row}: ${err.message}`),
        summary: {
          totalRows: csvData.length - 1,
          validRows: validationResult.validRows.length,
          invalidRows: validationResult.errors.length
        },
        validData: validationResult.validRows
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Error parsing file: ${error.message}`],
        summary: {
          totalRows: 0,
          validRows: 0,
          invalidRows: 0
        }
      };
    }
  }

  async importFromCsv(file: Express.Multer.File, kotaId: string, skenario: string | null = null): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File must be in .csv format');
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      // Get the "histories" data type ID for imported data
      const historiesDataType = await this.prisma.dataType.findUnique({
        where: { name: 'histories' }
      });

      if (!historiesDataType) {
        throw new BadRequestException('Data type "histories" not found. Please run the seeder first.');
      }

      const workbook = new ExcelJS.Workbook();
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      await workbook.csv.read(stream);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        throw new BadRequestException('CSV file is empty or invalid');
      }

      const csvData: any[][] = [];
      worksheet.eachRow((row, rowNumber) => {
        const values = row.values as any[];
        csvData.push(values.slice(1));
      });

      const validationResult = CsvValidator.validateCsvData(csvData);
      
      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(err => 
          `Row ${err.row}: ${err.message}`
        );
        throw new BadRequestException(`CSV validation failed:\n${errorMessages.join('\n')}`);
      }

      const dataGroups = new Map<string, ImportDataRowDto[]>();

      for (const row of validationResult.validRows) {
        const groupKey = `${row.tahun}_${row.kategori}`;
        if (!dataGroups.has(groupKey)) {
          dataGroups.set(groupKey, []);
        }
        dataGroups.get(groupKey)!.push(row);
      }

      for (const [groupKey, rows] of dataGroups) {
        const [tahun, kategori] = groupKey.split('_');
        const tahunNum = parseInt(tahun);

        try {
          await this.processDataGroup(kotaId, tahunNum, kategori, rows, skenario, historiesDataType.id);
          imported += rows.length;
        } catch (error) {
          errors.push(`Error processing group ${groupKey}: ${error.message}`);
          failed += rows.length;
        }
      }

      return {
        status: failed === 0 ? 'success' : 'partial',
        imported,
        failed,
        errors,
        message: failed === 0 ? 'All data imported successfully' : `${imported} data imported successfully, ${failed} data failed`
      };

    } catch (error) {
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  private async processDataGroup(kotaId: string, tahun: number, kategori: string, rows: ImportDataRowDto[], skenario: string | null, dataTypeId: string) {
    // Ensure year record exists
    let tahunRecord = await this.prisma.years.findFirst({
      where: { year: tahun }
    });

    if (!tahunRecord) {
      tahunRecord = await this.prisma.years.create({
        data: { year: tahun }
      });
    }

    switch (kategori) {
      case 'populasi':
        await this.processPopulasiData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'pdrb':
        await this.processPdrbData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'pertanian':
        await this.processPertanianData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'peternakan':
        await this.processPeternakanData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'perikanan':
        await this.processPerikananData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      default:
        throw new Error(`Unknown category: ${kategori}`);
    }
  }

  private async processPopulasiData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const populasiData: any = {};
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'laki_laki':
          populasiData.male = row.nilai;
          break;
        case 'perempuan':
          populasiData.female = row.nilai;
          break;
        default:
          throw new Error(`Unknown parameter for population: ${row.parameter}`);
      }
    }

    // Calculate total if both male and female are provided
    if (populasiData.male !== undefined && populasiData.female !== undefined) {
      populasiData.total = populasiData.male + populasiData.female;
    }

    // Cari existing record atau buat baru
    const existingRecord = await this.prisma.population.findFirst({
      where: { 
        yearId: tahunId,
        scenarioId: skenario, // Will be null for histories data type
        cityId: kotaId,
        dataTypeId: dataTypeId
      }
    });

    if (existingRecord) {
      await this.prisma.population.update({
        where: { id: existingRecord.id },
        data: populasiData
      });
    } else {
      await this.prisma.population.create({
        data: { 
          ...populasiData, 
          yearId: tahunId,
          scenarioId: skenario, // Will be null for histories data type
          cityId: kotaId,
          dataTypeId: dataTypeId
        }
      });
    }
  }

  private async processPdrbData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const allowedPdrbParams = [
      'pertanian_kehutanan_perikanan', 'pertambangan_penggalian', 'industri_pengolahan',
      'pengadaan_listrik_gas', 'pengadaan_air_pengelolaan_sampah', 'konstruksi',
      'perdagangan_reparasi_mobil_motor', 'transportasi_pergudangan', 'penyediaan_akomodasi_makan_minum',
      'informasi_komunikasi', 'jasa_keuangan_asuransi', 'real_estate', 'jasa_perusahaan',
      'administrasi_pemerintahan_jaminan_sosial', 'jasa_pendidikan', 'jasa_kesehatan_kegiatan_sosial',
      'jasa_lainnya', 'produk_domestik_regional_bruto', 'pdrb_tanpa_migas', 'pdrb_non_pemerintahan'
    ];

    // Create separate records for each sector
    for (const row of rows) {
      if (allowedPdrbParams.includes(row.parameter)) {
        // Check if record exists
        const existingRecord = await this.prisma.gDRP.findFirst({
          where: { 
            yearId: tahunId,
            scenarioId: skenario, // Will be null for histories data type
            sector: row.parameter,
            cityId: kotaId,
            dataTypeId: dataTypeId
          }
        });

        if (existingRecord) {
          await this.prisma.gDRP.update({
            where: { id: existingRecord.id },
            data: { value: row.nilai }
          });
        } else {
          await this.prisma.gDRP.create({
            data: {
              yearId: tahunId,
              scenarioId: skenario, // Will be null for histories data type
              cityId: kotaId,
              dataTypeId: dataTypeId,
              sector: row.parameter,
              value: row.nilai
            }
          });
        }
      } else {
        throw new Error(`Unknown parameter for GDRP: ${row.parameter}`);
      }
    }
  }

  private async processPertanianData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const pertanianData: any = {};
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'lahan_panen_padi':
          pertanianData.rice_cultivation_area = row.nilai;
          break;
        default:
          throw new Error(`Unknown parameter for agriculture: ${row.parameter}`);
      }
    }

    // Cari existing record atau buat baru
    const existingRecord = await this.prisma.agriculture.findFirst({
      where: { 
        yearId: tahunId,
        scenarioId: skenario, // Will be null for histories data type
        cityId: kotaId,
        dataTypeId: dataTypeId
      }
    });

    if (existingRecord) {
      await this.prisma.agriculture.update({
        where: { id: existingRecord.id },
        data: pertanianData
      });
    } else {
      await this.prisma.agriculture.create({
        data: { 
          ...pertanianData, 
          yearId: tahunId,
          scenarioId: skenario, // Will be null for histories data type
          cityId: kotaId,
          dataTypeId: dataTypeId
        }
      });
    }
  }

  private async processPeternakanData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    // Group by jenis_ternak
    const peternakanGroups = new Map<string, number>();
    
    for (const row of rows) {
      const [jenisParam, jenisValue] = row.parameter.split('_');
      if (jenisParam === 'laju' && jenisValue) {
        peternakanGroups.set(jenisValue, row.nilai);
      } else {
        throw new Error(`Unknown parameter for livestock: ${row.parameter}. Expected format: laju_{livestock_type}`);
      }
    }

    for (const [jenisTerak, lajuPerubahan] of peternakanGroups) {
      // Cari existing record atau buat baru
      const existingRecord = await this.prisma.livestock.findFirst({
        where: { 
          yearId: tahunId,
          scenarioId: skenario, // Will be null for histories data type
          livestock_type: jenisTerak,
          cityId: kotaId,
          dataTypeId: dataTypeId
        }
      });

      if (existingRecord) {
        await this.prisma.livestock.update({
          where: { id: existingRecord.id },
          data: { change_rate: lajuPerubahan }
        });
      } else {
        await this.prisma.livestock.create({
          data: { 
            yearId: tahunId,
            scenarioId: skenario, // Will be null for histories data type
            cityId: kotaId,
            dataTypeId: dataTypeId,
            livestock_type: jenisTerak,
            change_rate: lajuPerubahan
          }
        });
      }
    }
  }

  private async processPerikananData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const perikananData: any = {};
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'laju_perubahan_area':
          perikananData.growth_rate = row.nilai;
          break;
        default:
          throw new Error(`Unknown parameter for fisheries: ${row.parameter}`);
      }
    }

    // Cari existing record atau buat baru
    const existingRecord = await this.prisma.fisheries.findFirst({
      where: { 
        yearId: tahunId,
        scenarioId: skenario, // Will be null for histories data type
        cityId: kotaId,
        dataTypeId: dataTypeId
      }
    });

    if (existingRecord) {
      await this.prisma.fisheries.update({
        where: { id: existingRecord.id },
        data: perikananData
      });
    } else {
      await this.prisma.fisheries.create({
        data: { 
          ...perikananData, 
          yearId: tahunId,
          scenarioId: skenario, // Will be null for histories data type
          cityId: kotaId,
          dataTypeId: dataTypeId
        }
      });
    }
  }
}
