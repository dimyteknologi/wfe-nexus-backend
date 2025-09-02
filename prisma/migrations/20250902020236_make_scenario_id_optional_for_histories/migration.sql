-- DropForeignKey
ALTER TABLE "agriculture" DROP CONSTRAINT "agriculture_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "fisheries" DROP CONSTRAINT "fisheries_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "gdrp" DROP CONSTRAINT "gdrp_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "livestock" DROP CONSTRAINT "livestock_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "population" DROP CONSTRAINT "population_scenarioId_fkey";

-- AlterTable
ALTER TABLE "agriculture" ALTER COLUMN "scenarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fisheries" ALTER COLUMN "scenarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gdrp" ALTER COLUMN "scenarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "livestock" ALTER COLUMN "scenarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "population" ALTER COLUMN "scenarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "population" ADD CONSTRAINT "population_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdrp" ADD CONSTRAINT "gdrp_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agriculture" ADD CONSTRAINT "agriculture_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisheries" ADD CONSTRAINT "fisheries_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
