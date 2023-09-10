import { PrismaClient, MaintenanceReport as PrismaMaintenanceReport, MaintenanceReportEntry as  PrismaMaintenanceReportEntry, Prisma } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceReport, MaintenanceReportEntry, MaintenanceReportRepository } from "../../src/repository/maintenance-report.repository";


const maintenanceReportFull = Prisma.validator<Prisma.MaintenanceReportArgs>() ({
    include: {
        entries: {
            include: {
                maintenanceObject:true
            }
        }
    }
});

const maintenanceReportEntryFull = Prisma.validator<Prisma.MaintenanceReportEntryArgs>() ({
    include: {
        maintenanceObject:true
    }
});

type MaintenanceReportFull = Prisma.MaintenanceReportGetPayload<typeof maintenanceReportFull>; 
type MaintenanceReportEntryFull = Prisma.MaintenanceReportEntryGetPayload<typeof maintenanceReportEntryFull>;

@singleton()
export class MaintenanceReportPrismaRepository implements MaintenanceReportRepository {
   
   
   
    allMaintenanceReports(_prisma: PrismaClient): Promise<MaintenanceReport[]> {
        
        return new Promise<MaintenanceReport[]>((resolve, reject) => {

            _prisma.maintenanceReport.findMany({
                include: {
                    entries: {
                        include: {
                            maintenanceObject: true
                        }
                    }
                }
            }).then(dbMaintenanceReports => {

                

                const result =  dbMaintenanceReports.map(dbMaintenanceReport => this.mapReportFromPrisma(dbMaintenanceReport))
                if(isEmpty(result)) {
                    reject(new Error('No Maintenance Reports found'));
                }

                resolve(result);

            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    


    findMaintenanceReportById(_prisma: PrismaClient, id: string):Promise<MaintenanceReport> {

        return new Promise<MaintenanceReport>((resolve, reject) => {

            _prisma.maintenanceReport.findUnique({
                where: {
                    id:id
                },
                include: {
                    entries: {
                        include: {
                            maintenanceObject: true
                            
                        }
                    }
                }
            }).then(dbMaintenanceReport => {

                if(!isNull(dbMaintenanceReport)) {
                    const report = this.mapReportFromPrisma(dbMaintenanceReport);
                    resolve(report);
                }

                reject(new Error(`No Maintenance Report found for ${id}`));

            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    findMaintenanceReportByYear(_prisma: PrismaClient, year: number):Promise<MaintenanceReport> {

        return new Promise<MaintenanceReport>((resolve, reject) => {

            _prisma.maintenanceReport.findFirst({
                where: {
                    year: year
                },
                include: {
                    entries: {
                        include: {
                            maintenanceObject: true
                            
                        }
                    }
                }
            }).then(dbMaintenanceReport => {

                if(!isNull(dbMaintenanceReport)) {
                    const report = this.mapReportFromPrisma(dbMaintenanceReport);
                    resolve(report);
                }

                reject(new Error(`No Maintenance Report found for year ${year}`));

            }).catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    private mapReportFromPrisma(dbMaintenanceReport: MaintenanceReportFull): MaintenanceReport {
        let report: MaintenanceReport = {
            id: dbMaintenanceReport.id,
            year: dbMaintenanceReport.year,
            entries: dbMaintenanceReport.entries.map(reportEntry => this.mapReportEntryFromPrisma(reportEntry))
        }

        return report;
    }

    private mapReportEntryFromPrisma(dbMaintenanceReport: MaintenanceReportEntryFull): MaintenanceReportEntry {
        let reportEntry: MaintenanceReportEntry = {
            id: dbMaintenanceReport.id,
            date: dbMaintenanceReport.date,
            maintainer: dbMaintenanceReport.maintainer,
            maintenanceObject: dbMaintenanceReport.maintenanceObject.name
        }

        return reportEntry;
    }

}