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
  private static readonly ALLOWED_CATEGORIES = ['populasi', 'pdrb', 'pertanian', 'peternakan', 'perikanan'];
  
  private static readonly CATEGORY_PARAMETERS = {
    populasi: ['laki_laki', 'perempuan'],
    pdrb: [
      'pertanian_kehutanan_perikanan', 'pertambangan_penggalian', 'industri_pengolahan',
      'pengadaan_listrik_gas', 'pengadaan_air_pengelolaan_sampah', 'konstruksi',
      'perdagangan_reparasi_mobil_motor', 'transportasi_pergudangan', 'penyediaan_akomodasi_makan_minum',
      'informasi_komunikasi', 'jasa_keuangan_asuransi', 'real_estate', 'jasa_perusahaan',
      'administrasi_pemerintahan_jaminan_sosial', 'jasa_pendidikan', 'jasa_kesehatan_kegiatan_sosial',
      'jasa_lainnya', 'produk_domestik_regional_bruto', 'pdrb_tanpa_migas', 'pdrb_non_pemerintahan'
    ],
    pertanian: ['lahan_panen_padi'],
    peternakan: [], // Dynamic parameters like laju_{jenis_ternak}
    perikanan: ['laju_perubahan_area']
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
        message: `Baris tidak lengkap. Diharapkan ${this.REQUIRED_HEADERS.length} kolom, ditemukan ${row.length}`
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
        message: 'Tahun harus berupa angka valid antara 1900-2100'
      });
    }

    // Validate kategori
    const cleanKategori = kategori?.toString().toLowerCase().trim();
    if (!cleanKategori || !this.ALLOWED_CATEGORIES.includes(cleanKategori)) {
      errors.push({
        row: rowNumber,
        field: 'kategori',
        value: kategori,
        message: `Kategori tidak valid. Kategori yang diizinkan: ${this.ALLOWED_CATEGORIES.join(', ')}`
      });
    }

    // Validate parameter
    const cleanParameter = parameter?.toString().toLowerCase().trim();
    if (!cleanParameter) {
      errors.push({
        row: rowNumber,
        field: 'parameter',
        value: parameter,
        message: 'Parameter tidak boleh kosong'
      });
    } else if (cleanKategori && this.CATEGORY_PARAMETERS[cleanKategori]) {
      const allowedParams = this.CATEGORY_PARAMETERS[cleanKategori];
      if (cleanKategori === 'peternakan') {
        // Special validation for peternakan (laju_{jenis_ternak})
        if (!cleanParameter.startsWith('laju_') || cleanParameter === 'laju_') {
          errors.push({
            row: rowNumber,
            field: 'parameter',
            value: parameter,
            message: 'Parameter peternakan harus berformat: laju_{jenis_ternak}'
          });
        }
      } else if (allowedParams.length > 0 && !allowedParams.includes(cleanParameter)) {
        errors.push({
          row: rowNumber,
          field: 'parameter',
          value: parameter,
          message: `Parameter tidak valid untuk kategori ${cleanKategori}. Parameter yang diizinkan: ${allowedParams.join(', ')}`
        });
      }
    }

    // Validate nilai
    const nilaiNum = parseFloat(nilai);
    if (isNaN(nilaiNum)) {
      errors.push({
        row: rowNumber,
        field: 'nilai',
        value: nilai,
        message: 'Nilai harus berupa angka'
      });
    }

    return errors;
  }

  static validateCsvData(data: any[][]): CsvValidationResult {
    if (!data || data.length === 0) {
      return {
        isValid: false,
        errors: [{ row: 0, field: 'general', value: null, message: 'File CSV kosong' }],
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
          message: `Header tidak sesuai. Diharapkan: ${this.REQUIRED_HEADERS.join(', ')}` 
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
        validRows.push({
          tahun: parseInt(row[0]),
          kategori: row[1]?.toString().toLowerCase().trim(),
          parameter: row[2]?.toString().toLowerCase().trim(),
          nilai: parseFloat(row[3])
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
