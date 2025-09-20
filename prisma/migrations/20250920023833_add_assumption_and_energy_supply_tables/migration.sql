-- CreateTable
CREATE TABLE "assumption" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT,
    "parameter" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_supply" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT,
    "parameter" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "energy_supply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assumption_yearId_cityId_dataTypeId_scenarioId_parameter_key" ON "assumption"("yearId", "cityId", "dataTypeId", "scenarioId", "parameter");

-- CreateIndex
CREATE UNIQUE INDEX "energy_supply_yearId_cityId_dataTypeId_scenarioId_parameter_key" ON "energy_supply"("yearId", "cityId", "dataTypeId", "scenarioId", "parameter");

-- AddForeignKey
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_supply" ADD CONSTRAINT "energy_supply_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_supply" ADD CONSTRAINT "energy_supply_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_supply" ADD CONSTRAINT "energy_supply_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_supply" ADD CONSTRAINT "energy_supply_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
