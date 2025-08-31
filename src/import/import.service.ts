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
          errors: ['File CSV kosong atau tidak valid'],
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
        errors: validationResult.errors.map(err => `Baris ${err.row}: ${err.message}`),
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

  async importFromCsv(file: Express.Multer.File, kotaId: string, skenario: string = 'baseline'): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File harus berformat .csv');
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      const workbook = new ExcelJS.Workbook();
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      await workbook.csv.read(stream);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        throw new BadRequestException('File CSV kosong atau tidak valid');
      }

      const csvData: any[][] = [];
      worksheet.eachRow((row, rowNumber) => {
        const values = row.values as any[];
        csvData.push(values.slice(1));
      });

      const validationResult = CsvValidator.validateCsvData(csvData);
      
      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(err => 
          `Baris ${err.row}: ${err.message}`
        );
        throw new BadRequestException(`Validasi CSV gagal:\n${errorMessages.join('\n')}`);
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
          await this.processDataGroup(kotaId, tahunNum, kategori, rows, skenario);
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
        message: failed === 0 ? 'Semua data berhasil diimport' : `${imported} data berhasil diimport, ${failed} data gagal`
      };

    } catch (error) {
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  private async processDataGroup(kotaId: string, tahun: number, kategori: string, rows: ImportDataRowDto[], skenario: string) {
    // Pastikan record tahun ada
    let tahunRecord = await this.prisma.tahun.findFirst({
      where: { tahun, kotaId }
    });

    if (!tahunRecord) {
      tahunRecord = await this.prisma.tahun.create({
        data: { tahun, kotaId }
      });
    }

    switch (kategori) {
      case 'populasi':
        await this.processPopulasiData(tahunRecord.id, rows, skenario);
        break;
      case 'pdrb':
        await this.processPdrbData(tahunRecord.id, rows, skenario);
        break;
      case 'pertanian':
        await this.processPertanianData(tahunRecord.id, rows, skenario);
        break;
      case 'peternakan':
        await this.processPeternakanData(tahunRecord.id, rows, skenario);
        break;
      case 'perikanan':
        await this.processPerikananData(tahunRecord.id, rows, skenario);
        break;
      default:
        throw new Error(`Kategori tidak dikenal: ${kategori}`);
    }
  }

  private async processPopulasiData(tahunId: string, rows: ImportDataRowDto[], skenario: string) {
    const populasiData: any = { skenario };
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'laki_laki':
          populasiData.laki_laki = row.nilai;
          break;
        case 'perempuan':
          populasiData.perempuan = row.nilai;
          break;
        default:
          throw new Error(`Parameter tidak dikenal untuk populasi: ${row.parameter}`);
      }
    }

    await this.prisma.populasi.upsert({
      where: { 
        tahunId_skenario: { tahunId, skenario }
      },
      update: populasiData,
      create: { ...populasiData, tahunId }
    });
  }

  private async processPdrbData(tahunId: string, rows: ImportDataRowDto[], skenario: string) {
    const pdrbData: any = { skenario };
    
    const allowedPdrbParams = [
      'pertanian_kehutanan_perikanan', 'pertambangan_penggalian', 'industri_pengolahan',
      'pengadaan_listrik_gas', 'pengadaan_air_pengelolaan_sampah', 'konstruksi',
      'perdagangan_reparasi_mobil_motor', 'transportasi_pergudangan', 'penyediaan_akomodasi_makan_minum',
      'informasi_komunikasi', 'jasa_keuangan_asuransi', 'real_estate', 'jasa_perusahaan',
      'administrasi_pemerintahan_jaminan_sosial', 'jasa_pendidikan', 'jasa_kesehatan_kegiatan_sosial',
      'jasa_lainnya', 'produk_domestik_regional_bruto', 'pdrb_tanpa_migas', 'pdrb_non_pemerintahan'
    ];

    for (const row of rows) {
      if (allowedPdrbParams.includes(row.parameter)) {
        pdrbData[row.parameter] = row.nilai;
      } else {
        throw new Error(`Parameter tidak dikenal untuk PDRB: ${row.parameter}`);
      }
    }

    await this.prisma.pDRB.upsert({
      where: { 
        tahunId_skenario: { tahunId, skenario }
      },
      update: pdrbData,
      create: { ...pdrbData, tahunId }
    });
  }

  private async processPertanianData(tahunId: string, rows: ImportDataRowDto[], skenario: string) {
    const pertanianData: any = { skenario };
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'lahan_panen_padi':
          pertanianData.lahan_panen_padi = row.nilai;
          break;
        default:
          throw new Error(`Parameter tidak dikenal untuk pertanian: ${row.parameter}`);
      }
    }

    await this.prisma.pertanian.upsert({
      where: { 
        tahunId_skenario: { tahunId, skenario }
      },
      update: pertanianData,
      create: { ...pertanianData, tahunId }
    });
  }

  private async processPeternakanData(tahunId: string, rows: ImportDataRowDto[], skenario: string) {
    // Group by jenis_ternak
    const peternakanGroups = new Map<string, number>();
    
    for (const row of rows) {
      const [jenisParam, jenisValue] = row.parameter.split('_');
      if (jenisParam === 'laju' && jenisValue) {
        peternakanGroups.set(jenisValue, row.nilai);
      } else {
        throw new Error(`Parameter tidak dikenal untuk peternakan: ${row.parameter}. Format yang diharapkan: laju_{jenis_ternak}`);
      }
    }

    for (const [jenisTerak, lajuPerubahan] of peternakanGroups) {
      await this.prisma.peternakan.upsert({
        where: { 
          tahunId_skenario_jenis_ternak: { tahunId, skenario, jenis_ternak: jenisTerak }
        },
        update: { laju_perubahan: lajuPerubahan },
        create: { 
          tahunId, 
          skenario, 
          jenis_ternak: jenisTerak, 
          laju_perubahan: lajuPerubahan 
        }
      });
    }
  }

  private async processPerikananData(tahunId: string, rows: ImportDataRowDto[], skenario: string) {
    const perikananData: any = { skenario };
    
    for (const row of rows) {
      switch (row.parameter) {
        case 'laju_perubahan_area':
          perikananData.laju_perubahan_area = row.nilai;
          break;
        default:
          throw new Error(`Parameter tidak dikenal untuk perikanan: ${row.parameter}`);
      }
    }

    await this.prisma.perikanan.upsert({
      where: { 
        tahunId_skenario: { tahunId, skenario }
      },
      update: perikananData,
      create: { ...perikananData, tahunId }
    });
  }
}
