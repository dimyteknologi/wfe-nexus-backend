# Template CSV untuk Import Data

## Format Umum
File CSV harus memiliki 4 kolom dengan header sebagai berikut:
```
tahun,kategori,parameter,nilai
```

## Deskripsi Kolom

### 1. tahun
- **Tipe**: Integer
- **Range**: 1900-2100
- **Contoh**: 2020, 2021, 2022
- **Deskripsi**: Tahun data

### 2. kategori
- **Tipe**: String
- **Nilai yang diizinkan**: 
  - `populasi` - Data populasi
  - `pdrb` - Data Produk Domestik Regional Bruto
  - `pertanian` - Data pertanian
  - `peternakan` - Data peternakan
  - `perikanan` - Data perikanan

### 3. parameter
- **Tipe**: String
- **Nilai tergantung kategori** (lihat detail di bawah)

### 4. nilai
- **Tipe**: Number (Float/Integer)
- **Deskripsi**: Nilai numerik dari parameter

---

## Detail Parameter per Kategori

### 📊 Kategori: `populasi`
**Parameter yang diizinkan:**
- `laki_laki` - Jumlah penduduk laki-laki
- `perempuan` - Jumlah penduduk perempuan

**Contoh:**
```csv
tahun,kategori,parameter,nilai
2020,populasi,laki_laki,150000
2020,populasi,perempuan,145000
```

### 💰 Kategori: `pdrb`
**Parameter yang diizinkan:**
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

**Contoh:**
```csv
tahun,kategori,parameter,nilai
2020,pdrb,pertanian_kehutanan_perikanan,1250000000
2020,pdrb,industri_pengolahan,2100000000
```

### 🌾 Kategori: `pertanian`
**Parameter yang diizinkan:**
- `lahan_panen_padi` - Luas lahan panen padi (dalam hektar)

**Contoh:**
```csv
tahun,kategori,parameter,nilai
2020,pertanian,lahan_panen_padi,15500
```

### 🐄 Kategori: `peternakan`
**Format parameter:** `laju_{jenis_ternak}`

**Contoh jenis ternak:**
- `laju_sapi` - Laju perubahan sapi
- `laju_kerbau` - Laju perubahan kerbau
- `laju_kambing` - Laju perubahan kambing
- `laju_domba` - Laju perubahan domba
- `laju_ayam` - Laju perubahan ayam
- `laju_{jenis_lainnya}` - Laju perubahan jenis ternak lainnya

**Contoh:**
```csv
tahun,kategori,parameter,nilai
2020,peternakan,laju_sapi,5.2
2020,peternakan,laju_kambing,8.5
```

### 🐟 Kategori: `perikanan`
**Parameter yang diizinkan:**
- `laju_perubahan_area` - Laju perubahan area perikanan

**Contoh:**
```csv
tahun,kategori,parameter,nilai
2020,perikanan,laju_perubahan_area,4.2
```

---

## Informasi Teknis Import

### 🔄 Proses Import
1. **Data Type**: Semua data yang diimport akan memiliki tipe `"histories"`
2. **Scenario ID**: Data historical akan memiliki `scenarioId = null`
3. **Validasi**: File CSV akan divalidasi sebelum import
4. **Duplikasi**: Data existing akan di-update jika ditemukan duplikasi

### 📝 Aturan Validasi
- Header CSV harus sesuai: `tahun,kategori,parameter,nilai`
- Tahun harus dalam range 1900-2100
- Kategori harus sesuai dengan yang diizinkan
- Parameter harus sesuai dengan kategori yang dipilih
- Nilai harus berupa angka

### 🎯 Target Storage
Data akan disimpan ke tabel berikut berdasarkan kategori:
- `populasi` → Table `population`
- `pdrb` → Table `gdrp`
- `pertanian` → Table `agriculture`
- `peternakan` → Table `livestock`
- `perikanan` → Table `fisheries`

---

## Template File
Gunakan file `template-import-data.csv` sebagai contoh format yang benar.

## Endpoint Import
**POST** `/import/csv`
- **multipart/form-data**
- **Field**: `file` (CSV file)
- **Query Params**: `kotaId` (required)
