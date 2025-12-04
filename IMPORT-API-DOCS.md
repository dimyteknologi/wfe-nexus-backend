# API Import Data Documentation

## Overview
API ini memungkinkan import data statistik regional dari file CSV dengan format yang sudah ditentukan. Sistem ini menyediakan validasi data yang komprehensif dan mendukung berbagai kategori data statistik.

## Endpoints

### 1. Validasi File CSV
```
POST /import/validate
```
Melakukan validasi format dan struktur file CSV tanpa melakukan import data.

### 2. Import Data dari CSV
```
POST /import/csv
```
Upload dan import data dari file CSV ke database.

## Authentication
- Memerlukan JWT token
- Permission required: `manage:data`

## Endpoint Details

### POST /import/validate

#### Parameters
- `file` (multipart/form-data): File CSV untuk divalidasi

#### Response
```json
{
  "isValid": true,
  "errors": [],
  "summary": {
    "totalRows": 10,
    "validRows": 10,
    "invalidRows": 0
  },
  "validData": [
    {
      "tahun": 2024,
      "kategori": "populasi",
      "parameter": "laki_laki",
      "nilai": 500000
    }
  ]
}
```

### POST /import/csv

#### Query Parameters
- `kotaId` (required): ID kota tujuan import data
- `skenario` (optional): Skenario data (default: "baseline")

#### Request Body
- `file`: File CSV dengan ekstensi .csv

#### Response
```json
{
  "status": "success",
  "imported": 150,
  "failed": 0,
  "errors": [],
  "message": "Semua data berhasil diimport"
}
```

## Format File CSV

### Header (Wajib)
File CSV harus memiliki header dengan kolom berikut:
```
tahun,kategori,parameter,nilai
```

### Kategori yang Didukung

#### 1. populasi
Parameters:
- `laki_laki`: Jumlah populasi laki-laki
- `perempuan`: Jumlah populasi perempuan

Example:
```csv
2024,populasi,laki_laki,500000
2024,populasi,perempuan,485000
```

#### 2. pdrb
Parameters:
- `pertanian_kehutanan_perikanan`
- `pertambangan_penggalian`
- `industri_pengolahan`
- `pengadaan_listrik_gas`
- `pengadaan_air_pengelolaan_sampah`
- `konstruksi`
- `perdagangan_reparasi_mobil_motor`
- `transportasi_pergudangan`
- `penyediaan_akomodasi_makan_minum`
- `informasi_komunikasi`
- `jasa_keuangan_asuransi`
- `real_estate`
- `jasa_perusahaan`
- `administrasi_pemerintahan_jaminan_sosial`
- `jasa_pendidikan`
- `jasa_kesehatan_kegiatan_sosial`
- `jasa_lainnya`
- `produk_domestik_regional_bruto`
- `pdrb_tanpa_migas`
- `pdrb_non_pemerintahan`

Example:
```csv
2024,pdrb,pertanian_kehutanan_perikanan,1500000000
2024,pdrb,industri_pengolahan,2500000000
```

#### 3. pertanian
Parameters:
- `lahan_panen_padi`: Luas lahan panen padi (hektar)

Example:
```csv
2024,pertanian,lahan_panen_padi,15000
```

#### 4. peternakan
Parameters:
- `laju_{jenis_ternak}`: Laju perubahan untuk jenis ternak tertentu
  - Format: `laju_` + nama jenis ternak
  - Contoh: `laju_sapi`, `laju_kambing`, `laju_ayam`

Example:
```csv
2024,peternakan,laju_sapi,0.05
2024,peternakan,laju_kambing,0.08
2024,peternakan,laju_ayam,0.12
```

#### 5. perikanan
Parameters:
- `laju_perubahan_area`: Laju perubahan area perikanan

Example:
```csv
2024,perikanan,laju_perubahan_area,0.03
```

## Contoh File CSV Lengkap
```csv
tahun,kategori,parameter,nilai
2024,populasi,laki_laki,500000
2024,populasi,perempuan,485000
2024,pdrb,pertanian_kehutanan_perikanan,1500000000
2024,pdrb,industri_pengolahan,2500000000
2024,pdrb,perdagangan_reparasi_mobil_motor,1800000000
2024,pertanian,lahan_panen_padi,15000
2024,peternakan,laju_sapi,0.05
2024,peternakan,laju_kambing,0.08
2024,peternakan,laju_ayam,0.12
2024,perikanan,laju_perubahan_area,0.03
2025,populasi,laki_laki,510000
2025,populasi,perempuan,492000
2025,pdrb,pertanian_kehutanan_perikanan,1550000000
2025,pdrb,industri_pengolahan,2600000000
2025,pertanian,lahan_panen_padi,15500
2025,perikanan,laju_perubahan_area,0.035
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "imported": 150,
  "failed": 0,
  "errors": [],
  "message": "Semua data berhasil diimport"
}
```

### Partial Success Response
```json
{
  "status": "partial",
  "imported": 145,
  "failed": 5,
  "errors": [
    "Baris 10: Tahun harus berupa angka valid antara 1900-2100",
    "Baris 15: Kategori 'invalid' tidak diizinkan"
  ],
  "message": "145 data berhasil diimport, 5 data gagal"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "File harus berformat .csv",
  "error": "Bad Request"
}
```

### Validation Response
```json
{
  "isValid": false,
  "errors": [
    "Baris 5: Tahun harus berupa angka valid antara 1900-2100",
    "Baris 8: Parameter tidak valid untuk kategori populasi"
  ],
  "summary": {
    "totalRows": 10,
    "validRows": 8,
    "invalidRows": 2
  },
  "validData": [...]
}
```

## Validasi

### File Validation
- File harus berekstensi .csv
- File tidak boleh kosong
- Header harus sesuai format: tahun,kategori,parameter,nilai

### Data Validation
- `tahun`: Harus berupa angka integer antara 1900-2100
- `kategori`: Harus salah satu dari kategori yang diizinkan
- `parameter`: Harus sesuai dengan parameter yang valid untuk kategori tersebut
- `nilai`: Harus berupa angka (integer atau float)

### Validation Rules by Category

#### populasi
- Valid parameters: `laki_laki`, `perempuan`
- Nilai harus positif

#### pdrb
- Valid parameters: 20 parameter ekonomi sesuai standar PDRB
- Nilai dalam rupiah (biasanya dalam milyaran)

#### pertanian
- Valid parameters: `lahan_panen_padi`
- Nilai dalam hektar

#### peternakan
- Valid parameters: `laju_{jenis_ternak}`
- Nilai berupa persentase dalam desimal (0.05 = 5%)

#### perikanan
- Valid parameters: `laju_perubahan_area`
- Nilai berupa persentase dalam desimal

## Behavior

### Data Processing
- Data diproses dalam batch berdasarkan tahun dan kategori
- Jika record sudah ada, akan di-update (upsert)
- Jika record tahun belum ada, akan dibuat otomatis
- Data dikelompokkan untuk efisiensi database operations

### Error Handling
- Jika ada error pada baris tertentu, baris tersebut akan dilewati
- Proses import akan tetap berlanjut untuk baris yang valid
- Semua error akan dikumpulkan dan dilaporkan dalam response
- Validasi dilakukan sebelum proses import untuk mencegah data corrupt

### Database Integration
- Menggunakan Prisma ORM untuk database operations
- Mendukung transaction untuk data consistency
- Auto-generate record tahun jika belum ada
- Upsert operation untuk menghindari duplicate data

## Usage Examples

### cURL - Validasi File
```bash
curl -X POST \
  http://localhost:3000/import/validate \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@contoh-import-data.csv'
```

### cURL - Import Data
```bash
curl -X POST \
  'http://localhost:3000/import/csv?kotaId=uuid-kota&skenario=baseline' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@contoh-import-data.csv'
```

### JavaScript (fetch) - Validasi
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/import/validate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  },
  body: formData
});

const result = await response.json();
console.log('Validation result:', result);
```

### JavaScript (fetch) - Import
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/import/csv?kotaId=uuid-kota&skenario=baseline', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  },
  body: formData
});

const result = await response.json();
console.log('Import result:', result);
```

## Best Practices

1. **Validasi Terlebih Dahulu**: Gunakan endpoint `/import/validate` sebelum melakukan import untuk mengidentifikasi masalah data.

2. **File Size Limit**: Rekomendasikan file CSV maksimal 10MB untuk performa optimal.

3. **Data Consistency**: Pastikan data tahun konsisten dalam satu file untuk menghindari konflik.

4. **Backup Data**: Lakukan backup database sebelum import data dalam jumlah besar.

5. **Error Handling**: Selalu check response untuk error dan handle sesuai kebutuhan aplikasi.

6. **Batch Processing**: Untuk data besar, pertimbangkan untuk membagi file menjadi beberapa batch.

## Technical Implementation

### Dependencies
- `exceljs`: Untuk parsing file CSV
- `multer`: Untuk handling file upload
- `@nestjs/platform-express`: Untuk Express file upload support
- `prisma`: Untuk database operations

### Security Considerations
- File extension validation (.csv only)
- File size validation (implementasi dapat ditambahkan)
- JWT authentication required
- Permission-based access control
- Input sanitization dan validation

### Performance Optimizations
- Batch processing untuk database operations
- Stream processing untuk file besar
- Efficient validation dengan early return
- Memory management untuk large datasets
