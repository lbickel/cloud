import { PrismaClient } from "@prisma/client";

export interface MaintenanceReport {
    id: string,
    entries: MaintenanceReportEntry[],
    year: number
}

export interface MaintenanceReportEntry {
    id: string,
    maintainer: string,
    maintenanceObject: string,
    date: string
}


export interface MaintenanceReportRepository {

    allMaintenanceReports(_prisma:PrismaClient): Promise<MaintenanceReport[]>;

    findMaintenanceReportById(_prisma:PrismaClient, id: string):Promise<MaintenanceReport>;
    findMaintenanceReportByYear(_prisma:PrismaClient, year: number):Promise<MaintenanceReport>;


}