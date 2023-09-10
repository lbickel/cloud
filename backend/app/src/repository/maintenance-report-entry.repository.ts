import { PrismaClient } from "@prisma/client";


export interface MaintenanceReportEntry {
    id: string,
    maintainer: string,
    maintenanceObject: string,
    maintenanceObjectId: string,
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

    findMaintenanceReportEntryById(_prisma:PrismaClient, id: string):Promise<MaintenanceReportEntry>;

    deleteMaintenanceReportEntry(_prisma:PrismaClient, id: string):Promise<MaintenanceReportEntry>;


}