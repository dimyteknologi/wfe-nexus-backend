/*
  Warnings:

  - A unique constraint covering the columns `[yearId,cityId,dataTypeId,scenarioId]` on the table `agriculture` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yearId,cityId,dataTypeId,scenarioId]` on the table `fisheries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yearId,cityId,dataTypeId,scenarioId,sector]` on the table `gdrp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yearId,cityId,dataTypeId,scenarioId,livestock_type]` on the table `livestock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yearId,cityId,dataTypeId,scenarioId]` on the table `population` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "gdrp_yearId_key";

-- DropIndex
DROP INDEX "population_yearId_key";

-- CreateIndex
CREATE UNIQUE INDEX "agriculture_yearId_cityId_dataTypeId_scenarioId_key" ON "agriculture"("yearId", "cityId", "dataTypeId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "fisheries_yearId_cityId_dataTypeId_scenarioId_key" ON "fisheries"("yearId", "cityId", "dataTypeId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "gdrp_yearId_cityId_dataTypeId_scenarioId_sector_key" ON "gdrp"("yearId", "cityId", "dataTypeId", "scenarioId", "sector");

-- CreateIndex
CREATE UNIQUE INDEX "livestock_yearId_cityId_dataTypeId_scenarioId_livestock_typ_key" ON "livestock"("yearId", "cityId", "dataTypeId", "scenarioId", "livestock_type");

-- CreateIndex
CREATE UNIQUE INDEX "population_yearId_cityId_dataTypeId_scenarioId_key" ON "population"("yearId", "cityId", "dataTypeId", "scenarioId");
