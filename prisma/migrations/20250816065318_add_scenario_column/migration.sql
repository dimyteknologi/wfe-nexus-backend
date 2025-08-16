/*
  Warnings:

  - A unique constraint covering the columns `[tahunId,skenario]` on the table `pdrb` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tahunId,skenario]` on the table `perikanan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tahunId,skenario]` on the table `pertanian` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tahunId,skenario,jenis_ternak]` on the table `peternakan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tahunId,skenario]` on the table `populasi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skenario` to the `pdrb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skenario` to the `perikanan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skenario` to the `pertanian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skenario` to the `peternakan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skenario` to the `populasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pdrb" ADD COLUMN     "skenario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "perikanan" ADD COLUMN     "skenario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pertanian" ADD COLUMN     "skenario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "peternakan" ADD COLUMN     "skenario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "populasi" ADD COLUMN     "skenario" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pdrb_tahunId_skenario_key" ON "pdrb"("tahunId", "skenario");

-- CreateIndex
CREATE UNIQUE INDEX "perikanan_tahunId_skenario_key" ON "perikanan"("tahunId", "skenario");

-- CreateIndex
CREATE UNIQUE INDEX "pertanian_tahunId_skenario_key" ON "pertanian"("tahunId", "skenario");

-- CreateIndex
CREATE UNIQUE INDEX "peternakan_tahunId_skenario_jenis_ternak_key" ON "peternakan"("tahunId", "skenario", "jenis_ternak");

-- CreateIndex
CREATE UNIQUE INDEX "populasi_tahunId_skenario_key" ON "populasi"("tahunId", "skenario");
