-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "permissionName" TEXT NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "year" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "data_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "population" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "male" DOUBLE PRECISION NOT NULL,
    "female" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "population_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gdrp" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sector" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gdrp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agriculture" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "rice_cultivation_area" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agriculture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestock" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "livestock_type" TEXT NOT NULL,
    "change_rate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fisheries" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "dataTypeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "growth_rate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fisheries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_permissionCode_key" ON "Permission"("permissionCode");

-- CreateIndex
CREATE UNIQUE INDEX "institution_name_key" ON "institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "year_year_key" ON "year"("year");

-- CreateIndex
CREATE UNIQUE INDEX "data_type_name_key" ON "data_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "population_yearId_key" ON "population"("yearId");

-- CreateIndex
CREATE UNIQUE INDEX "gdrp_yearId_key" ON "gdrp"("yearId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario" ADD CONSTRAINT "scenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "population" ADD CONSTRAINT "population_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "population" ADD CONSTRAINT "population_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "population" ADD CONSTRAINT "population_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "population" ADD CONSTRAINT "population_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdrp" ADD CONSTRAINT "gdrp_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdrp" ADD CONSTRAINT "gdrp_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdrp" ADD CONSTRAINT "gdrp_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdrp" ADD CONSTRAINT "gdrp_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agriculture" ADD CONSTRAINT "agriculture_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agriculture" ADD CONSTRAINT "agriculture_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agriculture" ADD CONSTRAINT "agriculture_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agriculture" ADD CONSTRAINT "agriculture_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestock" ADD CONSTRAINT "livestock_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisheries" ADD CONSTRAINT "fisheries_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisheries" ADD CONSTRAINT "fisheries_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisheries" ADD CONSTRAINT "fisheries_dataTypeId_fkey" FOREIGN KEY ("dataTypeId") REFERENCES "data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fisheries" ADD CONSTRAINT "fisheries_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
