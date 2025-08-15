/*
  Warnings:

  - The primary key for the `kota` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pdrb` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `perikanan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pertanian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `peternakan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `populasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tahun` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_kotaId_fkey";

-- DropForeignKey
ALTER TABLE "pdrb" DROP CONSTRAINT "pdrb_tahunId_fkey";

-- DropForeignKey
ALTER TABLE "perikanan" DROP CONSTRAINT "perikanan_tahunId_fkey";

-- DropForeignKey
ALTER TABLE "pertanian" DROP CONSTRAINT "pertanian_tahunId_fkey";

-- DropForeignKey
ALTER TABLE "peternakan" DROP CONSTRAINT "peternakan_tahunId_fkey";

-- DropForeignKey
ALTER TABLE "populasi" DROP CONSTRAINT "populasi_tahunId_fkey";

-- DropForeignKey
ALTER TABLE "tahun" DROP CONSTRAINT "tahun_kotaId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "kotaId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "kota" DROP CONSTRAINT "kota_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "kota_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "kota_id_seq";

-- AlterTable
ALTER TABLE "pdrb" DROP CONSTRAINT "pdrb_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tahunId" SET DATA TYPE TEXT,
ADD CONSTRAINT "pdrb_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pdrb_id_seq";

-- AlterTable
ALTER TABLE "perikanan" DROP CONSTRAINT "perikanan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tahunId" SET DATA TYPE TEXT,
ADD CONSTRAINT "perikanan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "perikanan_id_seq";

-- AlterTable
ALTER TABLE "pertanian" DROP CONSTRAINT "pertanian_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tahunId" SET DATA TYPE TEXT,
ADD CONSTRAINT "pertanian_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pertanian_id_seq";

-- AlterTable
ALTER TABLE "peternakan" DROP CONSTRAINT "peternakan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tahunId" SET DATA TYPE TEXT,
ADD CONSTRAINT "peternakan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "peternakan_id_seq";

-- AlterTable
ALTER TABLE "populasi" DROP CONSTRAINT "populasi_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tahunId" SET DATA TYPE TEXT,
ADD CONSTRAINT "populasi_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "populasi_id_seq";

-- AlterTable
ALTER TABLE "tahun" DROP CONSTRAINT "tahun_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "kotaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "tahun_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tahun_id_seq";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kotaId_fkey" FOREIGN KEY ("kotaId") REFERENCES "kota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
