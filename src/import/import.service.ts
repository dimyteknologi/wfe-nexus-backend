import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { ImportDataRowDto, ImportResultDto } from './dto/import-data.dto';
import { CsvValidator } from './csv-validator';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) { }

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
      // Validate that the city exists
      const city = await this.prisma.cities.findUnique({
        where: { id: kotaId }
      });

      if (!city) {
        throw new BadRequestException(`City with ID "${kotaId}" not found. Please ensure you are logged in with a valid user account.`);
      }

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
          // For histories data type, always use null scenario
          const scenarioForHistories = null;
          await this.processDataGroup(kotaId, tahunNum, kategori, rows, scenarioForHistories, historiesDataType.id);
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
        message: failed === 0 ? 'All data imported successfully' : `${imported} data imported successfully, ${failed} data failed`,
        data: await this.getFormattedData(kotaId, historiesDataType.id)
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
      case 'economy':
        await this.processEconomyData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'pertanian':
        await this.processPertanianData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'peternakan':
        await this.processPeternakanData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'assumption':
        await this.processAssumptionData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
        break;
      case 'energy supply':
        await this.processEnergySupplyData(tahunRecord.id, rows, skenario, kotaId, dataTypeId);
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

    // Process all rows to build complete population data
    for (const row of rows) {
      switch (row.parameter) {
        case 'laki-laki':
          populasiData.male = row.nilai;
          break;
        case 'perempuan':
          populasiData.female = row.nilai;
          break;
        case 'jumlah':
          populasiData.total = row.nilai;
          break;
        default:
          throw new Error(`Unknown parameter for population: ${row.parameter}`);
      }
    }

    // Calculate total if both male and female are provided
    if (populasiData.male !== undefined && populasiData.female !== undefined) {
      populasiData.total = populasiData.male + populasiData.female;
    }

    // Find existing record or create new one
    const whereCondition: any = {
      yearId: tahunId,
      cityId: kotaId,
      dataTypeId: dataTypeId
    };

    // Handle scenarioId: use null for histories, or specific scenario ID
    if (skenario === null) {
      whereCondition.scenarioId = null;
    } else {
      whereCondition.scenarioId = skenario;
    }

    const existingRecord = await this.prisma.population.findFirst({
      where: whereCondition
    });

    if (existingRecord) {
      await this.prisma.population.update({
        where: { id: existingRecord.id },
        data: populasiData
      });
    } else {
      const createData: any = {
        ...populasiData,
        yearId: tahunId,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Only include scenarioId if it's not null
      if (skenario !== null) {
        createData.scenarioId = skenario;
      }

      await this.prisma.population.create({
        data: createData
      });
    }
  }

  private async processEconomyData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const allowedEconomyParams = [
      'a.pertanian, kehutanan, dan perikanan',
      'b.pertambangan dan penggalian',
      'c.industri pengolahan',
      'd.pengadaan listrik dan gas',
      'e.pengadaan air, pengelolaan sampah, limbah dan daur ulang',
      'f.konstruksi',
      'g.perdagangan besar dan eceran; reparasi mobil dan sepeda motor',
      'h.transportasi dan pergudangan',
      'i.penyediaan akomodasi dan makan minum',
      'j.informasi dan komunikasi',
      'k.jasa keuangan dan asuransi',
      'l.real estate',
      'm,n.jasa perusahaan',
      'o.administrasi pemerintahan, pertahanan dan jaminan sosial wajib',
      'p.jasa pendidikan',
      'q.jasa kesehatan dan kegiatan sosial',
      'r,s,t,u.jasa lainnya',
      'produk domestik regional bruto',
      'pdrb tanpa migas',
      'produk domestik regional bruto non pemerintahan'
    ];

    // Create separate records for each sector
    for (const row of rows) {
      if (allowedEconomyParams.includes(row.parameter)) {
        // Check if record exists
        const whereCondition: any = {
          yearId: tahunId,
          sector: row.parameter,
          cityId: kotaId,
          dataTypeId: dataTypeId
        };

        // Handle scenarioId: use null for histories, or specific scenario ID
        if (skenario === null) {
          whereCondition.scenarioId = null;
        } else {
          whereCondition.scenarioId = skenario;
        }

        const existingRecord = await this.prisma.gDRP.findFirst({
          where: whereCondition
        });

        if (existingRecord) {
          await this.prisma.gDRP.update({
            where: { id: existingRecord.id },
            data: { value: row.nilai }
          });
        } else {
          const createData: any = {
            yearId: tahunId,
            cityId: kotaId,
            dataTypeId: dataTypeId,
            sector: row.parameter,
            value: row.nilai
          };

          // Only include scenarioId if it's not null
          if (skenario !== null) {
            createData.scenarioId = skenario;
          }

          await this.prisma.gDRP.create({
            data: createData
          });
        }
      } else {
        throw new Error(`Unknown parameter for Economy: ${row.parameter}`);
      }
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
        const whereCondition: any = {
          yearId: tahunId,
          sector: row.parameter,
          cityId: kotaId,
          dataTypeId: dataTypeId
        };

        // Handle scenarioId: use null for histories, or specific scenario ID
        if (skenario === null) {
          whereCondition.scenarioId = null;
        } else {
          whereCondition.scenarioId = skenario;
        }

        const existingRecord = await this.prisma.gDRP.findFirst({
          where: whereCondition
        });

        if (existingRecord) {
          await this.prisma.gDRP.update({
            where: { id: existingRecord.id },
            data: { value: row.nilai }
          });
        } else {
          const createData: any = {
            yearId: tahunId,
            cityId: kotaId,
            dataTypeId: dataTypeId,
            sector: row.parameter,
            value: row.nilai
          };

          // Only include scenarioId if it's not null
          if (skenario !== null) {
            createData.scenarioId = skenario;
          }

          await this.prisma.gDRP.create({
            data: createData
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
        case 'lahan panen padi [ha/tahun]':
          pertanianData.rice_cultivation_area = row.nilai;
          break;
        default:
          throw new Error(`Unknown parameter for agriculture: ${row.parameter}`);
      }
    }

    // Cari existing record atau buat baru
    const whereCondition: any = {
      yearId: tahunId,
      cityId: kotaId,
      dataTypeId: dataTypeId
    };

    // Handle scenarioId: use null for histories, or specific scenario ID
    if (skenario === null) {
      whereCondition.scenarioId = null;
    } else {
      whereCondition.scenarioId = skenario;
    }

    const existingRecord = await this.prisma.agriculture.findFirst({
      where: whereCondition
    });

    if (existingRecord) {
      await this.prisma.agriculture.update({
        where: { id: existingRecord.id },
        data: pertanianData
      });
    } else {
      const createData: any = {
        ...pertanianData,
        yearId: tahunId,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Only include scenarioId if it's not null
      if (skenario !== null) {
        createData.scenarioId = skenario;
      }

      await this.prisma.agriculture.create({
        data: createData
      });
    }
  }

  private async processPeternakanData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    // Map parameter to livestock type
    const peternakanMapping = {
      'laju perubahan ternak sapi [1/tahun]': 'sapi',
      'laju perubahan ternak kambing [1/tahun]': 'kambing'
    };

    for (const row of rows) {
      const livestockType = peternakanMapping[row.parameter];
      if (!livestockType) {
        throw new Error(`Unknown parameter for livestock: ${row.parameter}`);
      }

      // Cari existing record atau buat baru
      const whereCondition: any = {
        yearId: tahunId,
        livestock_type: livestockType,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Handle scenarioId: use null for histories, or specific scenario ID
      if (skenario === null) {
        whereCondition.scenarioId = null;
      } else {
        whereCondition.scenarioId = skenario;
      }

      const existingRecord = await this.prisma.livestock.findFirst({
        where: whereCondition
      });

      if (existingRecord) {
        await this.prisma.livestock.update({
          where: { id: existingRecord.id },
          data: { change_rate: row.nilai }
        });
      } else {
        const createData: any = {
          yearId: tahunId,
          cityId: kotaId,
          dataTypeId: dataTypeId,
          livestock_type: livestockType,
          change_rate: row.nilai
        };

        // Only include scenarioId if it's not null
        if (skenario !== null) {
          createData.scenarioId = skenario;
        }

        await this.prisma.livestock.create({
          data: createData
        });
      }
    }
  }

  private async processPerikananData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    const perikananData: any = {};

    for (const row of rows) {
      switch (row.parameter) {
        case 'laju perubahan area perikanan [1/tahun]':
          perikananData.growth_rate = row.nilai
          break;
        default:
          throw new Error(`Unknown parameter for fisheries: ${row.parameter}`);
      }
    }

    // Cari existing record atau buat baru
    const whereCondition: any = {
      yearId: tahunId,
      cityId: kotaId,
      dataTypeId: dataTypeId
    };

    // Handle scenarioId: use null for histories, or specific scenario ID
    if (skenario === null) {
      whereCondition.scenarioId = null;
    } else {
      whereCondition.scenarioId = skenario;
    }

    const existingRecord = await this.prisma.fisheries.findFirst({
      where: whereCondition
    });

    if (existingRecord) {
      await this.prisma.fisheries.update({
        where: { id: existingRecord.id },
        data: perikananData
      });
    } else {
      const createData: any = {
        ...perikananData,
        yearId: tahunId,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Only include scenarioId if it's not null
      if (skenario !== null) {
        createData.scenarioId = skenario;
      }

      await this.prisma.fisheries.create({
        data: createData
      });
    }
  }

  private async processAssumptionData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    for (const row of rows) {
      // Check if record exists
      const whereCondition: any = {
        yearId: tahunId,
        parameter: row.parameter,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Handle scenarioId: use null for histories, or specific scenario ID
      if (skenario === null) {
        whereCondition.scenarioId = null;
      } else {
        whereCondition.scenarioId = skenario;
      }

      const existingRecord = await this.prisma.assumption.findFirst({
        where: whereCondition
      });

      if (existingRecord) {
        await this.prisma.assumption.update({
          where: { id: existingRecord.id },
          data: { value: row.nilai }
        });
      } else {
        const createData: any = {
          yearId: tahunId,
          cityId: kotaId,
          dataTypeId: dataTypeId,
          parameter: row.parameter,
          value: row.nilai
        };

        // Only include scenarioId if it's not null
        if (skenario !== null) {
          createData.scenarioId = skenario;
        }

        await this.prisma.assumption.create({
          data: createData
        });
      }
    }
  }

  private async processEnergySupplyData(tahunId: string, rows: ImportDataRowDto[], skenario: string | null, kotaId: string, dataTypeId: string) {
    for (const row of rows) {
      // Check if record exists
      const whereCondition: any = {
        yearId: tahunId,
        parameter: row.parameter,
        cityId: kotaId,
        dataTypeId: dataTypeId
      };

      // Handle scenarioId: use null for histories, or specific scenario ID
      if (skenario === null) {
        whereCondition.scenarioId = null;
      } else {
        whereCondition.scenarioId = skenario;
      }

      const existingRecord = await this.prisma.energySupply.findFirst({
        where: whereCondition
      });

      if (existingRecord) {
        await this.prisma.energySupply.update({
          where: { id: existingRecord.id },
          data: { value: row.nilai }
        });
      } else {
        const createData: any = {
          yearId: tahunId,
          cityId: kotaId,
          dataTypeId: dataTypeId,
          parameter: row.parameter,
          value: row.nilai
        };

        // Only include scenarioId if it's not null
        if (skenario !== null) {
          createData.scenarioId = skenario;
        }

        await this.prisma.energySupply.create({
          data: createData
        });
      }
    }
  }

  async getFormattedData(kotaId: string, dataTypeId?: string): Promise<any> {
    // Default to histories data type if not specified
    let targetDataType = dataTypeId;
    if (!targetDataType) {
      const historiesDataType = await this.prisma.dataType.findUnique({
        where: { name: 'histories' }
      });
      if (!historiesDataType) {
        throw new BadRequestException('Data type "histories" not found.');
      }
      targetDataType = historiesDataType.id;
    }

    // Get all years with data
    const years = await this.prisma.years.findMany({
      orderBy: { year: 'asc' }
    });

    const result = {};

    // Get population data
    const populationData = await this.prisma.population.findMany({
      where: {
        cityId: kotaId,
        dataTypeId: targetDataType,
        scenarioId: null // For histories data type
      },
      include: {
        year: true
      },
      orderBy: {
        year: { year: 'asc' }
      }
    });

    if (populationData.length > 0) {
      const populationYears = populationData.map(d => d.year.year);
      result['get-population'] = {
        data: {
          label: 'populasi',
          unit: 'orang',
          years: populationYears,
          parameters: [
            {
              name: 'laki-laki',
              values: populationData.map(d => d.male)
            },
            {
              name: 'perempuan',
              values: populationData.map(d => d.female)
            }
          ]
        }
      };
    }

    // Get GDRP data
    const gdpData = await this.prisma.gDRP.findMany({
      where: {
        cityId: kotaId,
        dataTypeId: targetDataType,
        scenarioId: null // For histories data type
      },
      include: {
        year: true
      },
      orderBy: [
        { year: { year: 'asc' } },
        { sector: 'asc' }
      ]
    });

    if (gdpData.length > 0) {
      const gdpYears = [...new Set(gdpData.map(d => d.year.year))].sort();
      const sectors = [...new Set(gdpData.map(d => d.sector))];

      const sectorNameMapping = {
        'pertanian_kehutanan_perikanan': 'A.Pertanian, Kehutanan, dan Perikanan',
        'pertambangan_penggalian': 'B.Pertambangan dan Penggalian',
        'industri_pengolahan': 'C.Industri Pengolahan',
        'pengadaan_listrik_gas': 'D.Pengadaan Listrik dan Gas',
        'pengadaan_air_pengelolaan_sampah': 'E.Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang',
        'konstruksi': 'F.Konstruksi',
        'perdagangan_reparasi_mobil_motor': 'G.Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor',
        'transportasi_pergudangan': 'H.Transportasi dan Pergudangan',
        'penyediaan_akomodasi_makan_minum': 'I.Penyediaan Akomodasi dan Makan Minum',
        'informasi_komunikasi': 'J.Informasi dan Komunikasi',
        'jasa_keuangan_asuransi': 'K.Jasa Keuangan dan Asuransi',
        'real_estate': 'L.Real Estate',
        'jasa_perusahaan': 'M,N.Jasa Perusahaan',
        'administrasi_pemerintahan_jaminan_sosial': 'O.Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib',
        'jasa_pendidikan': 'P.Jasa Pendidikan',
        'jasa_kesehatan_kegiatan_sosial': 'Q.Jasa Kesehatan dan Kegiatan Sosial',
        'jasa_lainnya': 'R,S,T,U.Jasa lainnya',
        'produk_domestik_regional_bruto': 'Produk Domestik Regional Bruto',
        'pdrb_tanpa_migas': 'PDRB Tanpa Migas',
        'pdrb_non_pemerintahan': 'Produk Domestik Regional Bruto Non Pemerintahan'
      };

      const parameters = sectors.map(sector => {
        const sectorData = gdpData.filter(d => d.sector === sector);
        const values = gdpYears.map(year => {
          const yearData = sectorData.find(d => d.year.year === year);
          return yearData ? yearData.value : null;
        });

        return {
          name: sectorNameMapping[sector] || sector,
          values: values
        };
      });

      result['get-gdp'] = {
        data: {
          label: 'PDRB',
          unit: 'jutaan rupiah',
          years: gdpYears,
          parameters: parameters
        }
      };
    }

    // Get agriculture data
    const agricultureData = await this.prisma.agriculture.findMany({
      where: {
        cityId: kotaId,
        dataTypeId: targetDataType,
        scenarioId: null // For histories data type
      },
      include: {
        year: true
      },
      orderBy: {
        year: { year: 'asc' }
      }
    });

    if (agricultureData.length > 0) {
      const agricultureYears = agricultureData.map(d => d.year.year);
      result['get-pertanian'] = {
        data: {
          label: 'pertanian_luas',
          unit: 'ha/tahun',
          years: agricultureYears,
          parameters: [
            {
              name: 'Lahan Panen Padi',
              values: agricultureData.map(d => d.rice_cultivation_area)
            }
          ]
        }
      };
    }

    // Get livestock data
    const livestockData = await this.prisma.livestock.findMany({
      where: {
        cityId: kotaId,
        dataTypeId: targetDataType,
        scenarioId: null // For histories data type
      },
      include: {
        year: true
      },
      orderBy: [
        { year: { year: 'asc' } },
        { livestock_type: 'asc' }
      ]
    });

    if (livestockData.length > 0) {
      const livestockYears = [...new Set(livestockData.map(d => d.year.year))].sort();
      const livestockTypes = [...new Set(livestockData.map(d => d.livestock_type))];

      const livestockNameMapping = {
        'sapi': 'ternak sapi',
        'kambing': 'ternak kambing',
        'ayam': 'ternak ayam'
      };

      const parameters = livestockTypes.map(type => {
        const typeData = livestockData.filter(d => d.livestock_type === type);
        const values = livestockYears.map(year => {
          const yearData = typeData.find(d => d.year.year === year);
          return yearData ? yearData.change_rate : null;
        });

        return {
          name: livestockNameMapping[type] || type,
          values: values
        };
      });

      result['get-peternakan'] = {
        data: {
          label: 'peternakan_laju_perubahan',
          unit: '1/tahun',
          years: livestockYears,
          parameters: parameters
        }
      };
    }

    // Get fisheries data
    const fisheriesData = await this.prisma.fisheries.findMany({
      where: {
        cityId: kotaId,
        dataTypeId: targetDataType,
        scenarioId: null // For histories data type
      },
      include: {
        year: true
      },
      orderBy: {
        year: { year: 'asc' }
      }
    });

    if (fisheriesData.length > 0) {
      const fisheriesYears = fisheriesData.map(d => d.year.year);
      result['get-perikanan'] = {
        data: {
          label: 'area_perikanan_laju_perubahan',
          unit: '1/tahun',
          years: fisheriesYears,
          parameters: [
            {
              name: 'area perikanan',
              values: fisheriesData.map(d => d.growth_rate)
            }
          ]
        }
      };
    }

    return result;
  }
}
