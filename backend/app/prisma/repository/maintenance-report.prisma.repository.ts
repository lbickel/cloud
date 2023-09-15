import { PrismaClient, Prisma } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceReport,  MaintenanceReportCreation,  MaintenanceReportRepository } from "../../src/repository/maintenance-report.repository";
import { MaintenanceReportEntry } from "../../src/repository/maintenance-report-entry.repository";
import { MaintenanceReportEntryPrismaRepository } from "./maintenance-report-entry.prisma.repository";


const maintenanceReportFull = Prisma.validator<Prisma.MaintenanceReportDefaultArgs>() ({
    include: {
        entries: {
            include: {
                maintenanceObject:true
            }
        }
    }
});



type MaintenanceReportFull = Prisma.MaintenanceReportGetPayload<typeof maintenanceReportFull>; 

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

    createMaintenanceReport(_prisma: PrismaClient, newMaintenanceReport: MaintenanceReportCreation, tenantID: string): Promise<MaintenanceReport> {
        
        let maintenanceReport: Prisma.MaintenanceReportCreateInput;
        const includeMaintenanceReportEntries = !isEmpty(newMaintenanceReport.entries);

        if(!includeMaintenanceReportEntries) {
            maintenanceReport = {
                year: newMaintenanceReport.year,
                tenantId: tenantID
            }
        } else {
            const entries = newMaintenanceReport.entries?.map(entry => {

                let entryCreation: Prisma.MaintenanceReportEntryCreateManyMaintenanceReportInput = {
                    date: entry.date,
                    maintainer: entry.maintainer,
                    maintenanceObjectId: entry.maintenanceObjectId,
                    tenantId: tenantID
                    
                }
                return entryCreation;
            }) as Prisma.MaintenanceReportEntryCreateManyMaintenanceReportInput [];

            maintenanceReport = {
                year: newMaintenanceReport.year,
                tenantId: tenantID,
                entries: {
                    createMany: {
                        data: entries
                    } 
                }
            }
        }


        return new Promise<MaintenanceReport>((resolve, reject) => {
            _prisma.maintenanceReport.create({
                data: maintenanceReport,
                include: {
                    entries: {
                        include: {
                            maintenanceObject: true
                            
                        }
                    }
                }
            })
            .then(dbMaintenanceReport => {

                if(!isNull(dbMaintenanceReport)) {
                    const maintenanceObject = this.mapReportFromPrisma(dbMaintenanceReport);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Report could not be created: ${newMaintenanceReport.year}`));

            }).catch(error => {
                reject(error);
            });
        });

        
    }

    updateMaintenanceReport(_prisma: PrismaClient, newMaintenanceReport: MaintenanceReport): Promise<MaintenanceReport> {
        
        let maintenanceInput: Prisma.MaintenanceReportUpdateInput;
        const includeMaintenanceReportEntries = !isEmpty(newMaintenanceReport.entries);

        if(!includeMaintenanceReportEntries) {
            maintenanceInput = {
                year: newMaintenanceReport.year
            }
        } else {
            const entries = newMaintenanceReport.entries?.map(entry => {

                let entryCreation: Prisma.MaintenanceReportEntryUncheckedUpdateWithoutMaintenanceReportInput = {
                    date: entry.date,
                    maintainer: entry.maintainer,
                    id: entry.id,
                    maintenanceObjectId: entry.maintenanceObjectId
                    
                    
                }
                return entryCreation;
            }) as Prisma.MaintenanceReportEntryCreateManyMaintenanceReportInput [];

            maintenanceInput = {
                year: newMaintenanceReport.year,
                entries: {
                    createMany: {
                        data: entries
                    } 
                }
            }
        }


        return new Promise<MaintenanceReport>((resolve, reject) => {

            _prisma.maintenanceReport.update({
                where: {
                    id: newMaintenanceReport.id
                },
                include: {
                    entries: {
                        include: {
                            maintenanceObject: true
                            
                        }
                    }
                },
                data: maintenanceInput
            })
            .then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = this.mapReportFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Report could not be updated: ${newMaintenanceReport.id}}`));

            }).catch(error => {
                reject(error);
            });
        });
    }

    deleteMaintenanceReport(_prisma: PrismaClient, id: string): Promise<MaintenanceReport> {
        
        return new Promise<MaintenanceReport>((resolve, reject) => {
            _prisma.maintenanceReport.delete({
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
                    const maintenanceObject = this.mapReportFromPrisma(dbMaintenanceReport);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Report could not be deleted: ${id} `));

            }).catch(error => {
                reject(error);
            });
        });
    }




    private mapReportFromPrisma(dbMaintenanceReport: MaintenanceReportFull): MaintenanceReport {
        let report: MaintenanceReport = {
            id: dbMaintenanceReport.id,
            year: dbMaintenanceReport.year,
            entries: dbMaintenanceReport.entries.map(reportEntry => MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(reportEntry))
        }

        return report;
    }

    

}