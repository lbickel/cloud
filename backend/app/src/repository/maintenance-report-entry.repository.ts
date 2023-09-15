import { PrismaClient } from "@prisma/client";


export interface MaintenanceReportEntry {
    id: string,
    maintainer: string,
    maintenanceObject: string,
    maintenanceObjectId: string,
    maintenanceReportId: string,
    date: string
}

export interface MaintenanceReportEntryCreation {
    maintainer: string,
    date: string,
    maintenanceObjectId: string,
    maintenanceReportId: string
}


export interface MaintenanceReportEntryRepository {

    allMaintenanceReportEntries(_prisma:PrismaClient): Promise<MaintenanceReportEntry[]>;

    findMaintenanceReportEntryById(_prisma:PrismaClient, id: string): Promise<MaintenanceReportEntry>;
    
    createMaintenanceReportEntry(_prisma: PrismaClient, newMaintenanceReportEntry: MaintenanceReportEntryCreation, tenantID: string): Promise<MaintenanceReportEntry>;

    updateMaintenanceReportEntry(_prisma: PrismaClient, updatedMaintenanceReportEntry: MaintenanceReportEntry): Promise<MaintenanceReportEntry>;

    deleteMaintenanceReportEntry(_prisma:PrismaClient, id: string): Promise<MaintenanceReportEntry>;


}