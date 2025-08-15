-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "kotaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "permissionName" TEXT NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kota" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahun" (
    "id" SERIAL NOT NULL,
    "tahun" INTEGER NOT NULL,
    "kotaId" INTEGER NOT NULL,

    CONSTRAINT "tahun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "populasi" (
    "id" SERIAL NOT NULL,
    "tahunId" INTEGER NOT NULL,
    "laki_laki" DOUBLE PRECISION NOT NULL,
    "perempuan" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "populasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdrb" (
    "id" SERIAL NOT NULL,
    "tahunId" INTEGER NOT NULL,
    "pertanian_kehutanan_perikanan" DOUBLE PRECISION,
    "pertambangan_penggalian" DOUBLE PRECISION,
    "industri_pengolahan" DOUBLE PRECISION,
    "pengadaan_listrik_gas" DOUBLE PRECISION,
    "pengadaan_air_pengelolaan_sampah" DOUBLE PRECISION,
    "konstruksi" DOUBLE PRECISION,
    "perdagangan_reparasi_mobil_motor" DOUBLE PRECISION,
    "transportasi_pergudangan" DOUBLE PRECISION,
    "penyediaan_akomodasi_makan_minum" DOUBLE PRECISION,
    "informasi_komunikasi" DOUBLE PRECISION,
    "jasa_keuangan_asuransi" DOUBLE PRECISION,
    "real_estate" DOUBLE PRECISION,
    "jasa_perusahaan" DOUBLE PRECISION,
    "administrasi_pemerintahan_jaminan_sosial" DOUBLE PRECISION,
    "jasa_pendidikan" DOUBLE PRECISION,
    "jasa_kesehatan_kegiatan_sosial" DOUBLE PRECISION,
    "jasa_lainnya" DOUBLE PRECISION,
    "produk_domestik_regional_bruto" DOUBLE PRECISION,
    "pdrb_tanpa_migas" DOUBLE PRECISION,
    "pdrb_non_pemerintahan" DOUBLE PRECISION,

    CONSTRAINT "pdrb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pertanian" (
    "id" SERIAL NOT NULL,
    "tahunId" INTEGER NOT NULL,
    "lahan_panen_padi" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pertanian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peternakan" (
    "id" SERIAL NOT NULL,
    "tahunId" INTEGER NOT NULL,
    "jenis_ternak" TEXT NOT NULL,
    "laju_perubahan" DOUBLE PRECISION,

    CONSTRAINT "peternakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perikanan" (
    "id" SERIAL NOT NULL,
    "tahunId" INTEGER NOT NULL,
    "laju_perubahan_area" DOUBLE PRECISION,

    CONSTRAINT "perikanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permissionCode_key" ON "Permission"("permissionCode");

-- CreateIndex
CREATE UNIQUE INDEX "kota_nama_key" ON "kota"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "tahun_tahun_kotaId_key" ON "tahun"("tahun", "kotaId");

-- CreateIndex
CREATE UNIQUE INDEX "populasi_tahunId_key" ON "populasi"("tahunId");

-- CreateIndex
CREATE UNIQUE INDEX "pdrb_tahunId_key" ON "pdrb"("tahunId");

-- CreateIndex
CREATE UNIQUE INDEX "pertanian_tahunId_key" ON "pertanian"("tahunId");

-- CreateIndex
CREATE UNIQUE INDEX "perikanan_tahunId_key" ON "perikanan"("tahunId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kotaId_fkey" FOREIGN KEY ("kotaId") REFERENCES "kota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tahun" ADD CONSTRAINT "tahun_kotaId_fkey" FOREIGN KEY ("kotaId") REFERENCES "kota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "populasi" ADD CONSTRAINT "populasi_tahunId_fkey" FOREIGN KEY ("tahunId") REFERENCES "tahun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdrb" ADD CONSTRAINT "pdrb_tahunId_fkey" FOREIGN KEY ("tahunId") REFERENCES "tahun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pertanian" ADD CONSTRAINT "pertanian_tahunId_fkey" FOREIGN KEY ("tahunId") REFERENCES "tahun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peternakan" ADD CONSTRAINT "peternakan_tahunId_fkey" FOREIGN KEY ("tahunId") REFERENCES "tahun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perikanan" ADD CONSTRAINT "perikanan_tahunId_fkey" FOREIGN KEY ("tahunId") REFERENCES "tahun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
