/*
  Warnings:

  - You are about to drop the column `name` on the `scenario_configuration` table. All the data in the column will be lost.
  - Added the required column `category` to the `scenario_configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `scenario_configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subType` to the `scenario_configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scenario_configuration" DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "subType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "scenario_configuration_category_idx" ON "scenario_configuration"("category");

-- CreateIndex
CREATE INDEX "scenario_configuration_subType_idx" ON "scenario_configuration"("subType");

-- CreateIndex
CREATE INDEX "scenario_configuration_period_idx" ON "scenario_configuration"("period");
