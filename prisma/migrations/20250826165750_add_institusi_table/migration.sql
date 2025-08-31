/*
  Warnings:

  - Added the required column `institusiId` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "Institusi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Institusi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institusi_nama_key" ON "Institusi"("nama");

-- Insert default institusi
INSERT INTO "Institusi" ("id", "nama", "updatedBy") VALUES ('default-institusi-id', 'Default Institusi', 'system');

-- AlterTable - Add column with default value first
ALTER TABLE "User" ADD COLUMN "institusiId" TEXT DEFAULT 'default-institusi-id';

-- Update existing users to use default institusi
UPDATE "User" SET "institusiId" = 'default-institusi-id' WHERE "institusiId" IS NULL;

-- Make the column required (remove default)
ALTER TABLE "User" ALTER COLUMN "institusiId" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "institusiId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institusiId_fkey" FOREIGN KEY ("institusiId") REFERENCES "Institusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
