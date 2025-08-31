/*
  Warnings:

  - You are about to drop the `Institusi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_institusiId_fkey";

-- DropTable
DROP TABLE "Institusi";

-- CreateTable
CREATE TABLE "institusi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "institusi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institusi_nama_key" ON "institusi"("nama");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institusiId_fkey" FOREIGN KEY ("institusiId") REFERENCES "institusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
