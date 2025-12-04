export interface CsvValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface CsvValidationResult {
  isValid: boolean;
  errors: CsvValidationError[];
  validRows: any[];
}

export class CsvValidator {
  private static readonly REQUIRED_HEADERS = ['tahun', 'kategori', 'parameter', 'nilai'];
  private static readonly ALLOWED_CATEGORIES = [
    'assumption', 'economy', 'populasi', 'pertanian', 'peternakan', 'energy supply', 'perikanan'
  ];

  private static readonly CATEGORY_PARAMETERS = {
    assumption: [
      'falkenmark standard: no stress',
      'falkenmark standard: stress',
      'falkenmark standard: scarcity',
      'electricity per capita national [kwh/cap/year]'
    ],
    economy: [
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
    ],
    populasi: ['laki-laki', 'perempuan', 'jumlah'],
    pertanian: ['lahan panen padi [ha/tahun]'],
    peternakan: [
      'laju perubahan ternak sapi [1/tahun]',
      'laju perubahan ternak kambing [1/tahun]'
    ],
    perikanan: [
      'laju perubahan area perikanan [1/tahun]',
    ],
    'energy supply': ['availability factor']
  };

  static validateHeaders(headers: string[]): boolean {
    const cleanHeaders = headers.map(h => h?.toLowerCase().trim()).filter(h => h);
    return this.REQUIRED_HEADERS.every(required => cleanHeaders.includes(required));
  }

  static validateRow(row: any[], rowNumber: number): CsvValidationError[] {
    const errors: CsvValidationError[] = [];

    // Check if row has required number of columns
    if (row.length < this.REQUIRED_HEADERS.length) {
      errors.push({
        row: rowNumber,
        field: 'general',
        value: row,
        message: `Incomplete row. Expected ${this.REQUIRED_HEADERS.length} columns, found ${row.length}`
      });
      return errors;
    }

    const [tahun, kategori, parameter, nilai] = row;

    // Validate tahun
    const tahunNum = parseInt(tahun);
    if (isNaN(tahunNum) || tahunNum < 1900 || tahunNum > 2100) {
      errors.push({
        row: rowNumber,
        field: 'tahun',
        value: tahun,
        message: 'Year must be a valid number between 1900-2100'
      });
    }

    // Validate kategori
    const cleanKategori = kategori?.toString().toLowerCase().trim();
    if (!cleanKategori || !this.ALLOWED_CATEGORIES.includes(cleanKategori)) {
      errors.push({
        row: rowNumber,
        field: 'kategori',
        value: kategori,
        message: `Invalid category. Allowed categories: ${this.ALLOWED_CATEGORIES.join(', ')}`
      });
    }

    // Validate parameter
    const cleanParameter = parameter?.toString().toLowerCase().trim();
    if (!cleanParameter) {
      errors.push({
        row: rowNumber,
        field: 'parameter',
        value: parameter,
        message: 'Parameter cannot be empty'
      });
    } else if (cleanKategori && this.CATEGORY_PARAMETERS[cleanKategori]) {
      const allowedParams = this.CATEGORY_PARAMETERS[cleanKategori];
      if (allowedParams.length > 0 && !allowedParams.includes(cleanParameter)) {
        errors.push({
          row: rowNumber,
          field: 'parameter',
          value: parameter,
          message: `Invalid parameter for category ${cleanKategori}. Allowed parameters: ${allowedParams.join(', ')}`
        });
      }
    }

    // Validate value
    const cleanNilai = nilai?.toString().replace(/[\s,]/g, ''); // Remove spaces and commas
    const nilaiNum = parseFloat(cleanNilai);
    if (isNaN(nilaiNum)) {
      errors.push({
        row: rowNumber,
        field: 'nilai',
        value: nilai,
        message: 'Value must be a number'
      });
    }

    return errors;
  }

  static validateCsvData(data: any[][]): CsvValidationResult {
    if (!data || data.length === 0) {
      return {
        isValid: false,
        errors: [{ row: 0, field: 'general', value: null, message: 'CSV file is empty' }],
        validRows: []
      };
    }

    // Validate headers
    const headers = data[0];
    if (!this.validateHeaders(headers)) {
      return {
        isValid: false,
        errors: [{
          row: 1,
          field: 'headers',
          value: headers,
          message: `Header mismatch. Expected: ${this.REQUIRED_HEADERS.join(', ')}`
        }],
        validRows: []
      };
    }

    const errors: CsvValidationError[] = [];
    const validRows: any[] = [];

    // Validate data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowErrors = this.validateRow(row, i + 1);

      if (rowErrors.length === 0) {
        const cleanNilai = row[3]?.toString().replace(/[\s,]/g, ''); // Remove spaces and commas
        validRows.push({
          tahun: parseInt(row[0]),
          kategori: row[1]?.toString().toLowerCase().trim(),
          parameter: row[2]?.toString().toLowerCase().trim(),
          nilai: parseFloat(cleanNilai)
        });
      } else {
        errors.push(...rowErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validRows
    };
  }
}
