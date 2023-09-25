-- CreateTable
CREATE TABLE "MaintenanceObject" (
    "tenantId" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MaintenanceObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceReport" (
    "tenantId" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceReportEntry" (
    "tenantId" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "maintainer" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "maintenanceReportId" UUID NOT NULL,
    "maintenanceObjectId" UUID NOT NULL,

    CONSTRAINT "MaintenanceReportEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceReportEntry" ADD CONSTRAINT "MaintenanceReportEntry_maintenanceObjectId_fkey" FOREIGN KEY ("maintenanceObjectId") REFERENCES "MaintenanceObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceReportEntry" ADD CONSTRAINT "MaintenanceReportEntry_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "MaintenanceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

