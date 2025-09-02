-- CreateTable
CREATE TABLE "scenario_configuration" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "scenario_configuration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scenario_configuration" ADD CONSTRAINT "scenario_configuration_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
