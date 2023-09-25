import { PrismaClient } from "@prisma/client";
import { MaintenanceReportEntry, MaintenanceReportEntryCreation } from "./maintenance-report-entry.repository";

export interface MaintenanceReport {
    id: string,
    entries: MaintenanceReportEntry[],
    year: number
}

export interface MaintenanceReportCreation {
    entries?: MaintenanceReportEntryCreation[],
    year: number
}


export interface MaintenanceReportRepository {

    allMaintenanceReports(_prisma:PrismaClient): Promise<MaintenanceReport[]>;
    findMaintenanceReportById(_prisma:PrismaClient, id: string):Promise<MaintenanceReport>;
    findMaintenanceReportByYear(_prisma:PrismaClient, year: number):Promise<MaintenanceReport>;
    deleteMaintenanceReport(_prisma:PrismaClient, id: string):Promise<MaintenanceReport>;
    createMaintenanceReport(_prisma: PrismaClient, newMaintenanceReport: MaintenanceReportCreation, tenantID: string): Promise<MaintenanceReport>;
    updateMaintenanceReport(_prisma: PrismaClient, newMaintenanceReport: MaintenanceReport): Promise<MaintenanceReport>


}