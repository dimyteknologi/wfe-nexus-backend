/*
  Warnings:

  - Added the required column `cityId` to the `scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scenario" ADD COLUMN     "cityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "scenario" ADD CONSTRAINT "scenario_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
