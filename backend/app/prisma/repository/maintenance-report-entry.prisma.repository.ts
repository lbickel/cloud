import { Prisma, PrismaClient, MaintenanceReportEntry as PrismaMaintenanceReportEntry } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceReportEntry, MaintenanceReportEntryCreation, MaintenanceReportEntryRepository } from "../../src/repository/maintenance-report-entry.repository";

const maintenanceReportEntryFull = Prisma.validator<Prisma.MaintenanceReportEntryDefaultArgs>() ({
    include: {
        maintenanceObject:true
    }
});
type MaintenanceReportEntryFull = Prisma.MaintenanceReportEntryGetPayload<typeof maintenanceReportEntryFull>;

@singleton()
export class MaintenanceReportEntryPrismaRepository implements MaintenanceReportEntryRepository {

    allMaintenanceReportEntries(_prisma: PrismaClient): Promise<MaintenanceReportEntry[]> {

        return new Promise<MaintenanceReportEntry[]>((resolve, reject) => {

            _prisma.maintenanceReportEntry.findMany({
                include: {
                    maintenanceObject: true
                }
            }).then(dbMaintenanceReportEntry => {
                const result = dbMaintenanceReportEntry.map(dbMaintenanceObject => MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(dbMaintenanceObject));
                
                if(isEmpty(result)) {
                    reject(new Error('No Maintenance Entries found'));
                }

                resolve(result);
            }).catch(error => {
                reject(error);
            })
        });
    }

    findMaintenanceReportEntryById(_prisma:PrismaClient, id: string): Promise<MaintenanceReportEntry> {

        return new Promise<MaintenanceReportEntry>((resolve, reject) => {
            _prisma.maintenanceReportEntry.findUnique({
                where: {
                    id:id
                },
                include: {
                    maintenanceObject: true
                }
            }).then(dbMaintenanceReportEntry => {

                if(!isNull(dbMaintenanceReportEntry)) {
                    const maintenanceObject = MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(dbMaintenanceReportEntry);
                    resolve(maintenanceObject);
                }

                reject(new Error(`No Maintenance Entry found for id: ${id}`));

            }).catch(error => {
                reject(error);
            });
        });
    }

    createMaintenanceReportEntry(_prisma: PrismaClient, newMaintenanceReportEntry: MaintenanceReportEntryCreation, tenantID: string): Promise<MaintenanceReportEntry> {
        
        return new Promise<MaintenanceReportEntry>((resolve, reject) => {
            _prisma.maintenanceReportEntry.create({
                data: {
                    date: newMaintenanceReportEntry.date,
                    maintainer: newMaintenanceReportEntry.maintainer,
                    maintenanceObjectId: newMaintenanceReportEntry.maintenanceObjectId,
                    maintenanceReportId: newMaintenanceReportEntry.maintenanceReportId,
                    tenantId: tenantID
                },
                include: {
                    maintenanceObject: true
                }
            })
            .then(dbMaintenanceReportEntry => {

                if(!isNull(dbMaintenanceReportEntry)) {
                    const maintenanceObject = MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(dbMaintenanceReportEntry);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Entry could not be created: ${newMaintenanceReportEntry}`));

            }).catch(error => {
                reject(error);
            });
        });

        
    }

    updateMaintenanceReportEntry(_prisma: PrismaClient, updatedMaintenanceReportEntry: MaintenanceReportEntry): Promise<MaintenanceReportEntry> {
        
        return new Promise<MaintenanceReportEntry>((resolve, reject) => {
            _prisma.maintenanceReportEntry.update({
                where: {
                    id: updatedMaintenanceReportEntry.id
                },
                include: {
                    maintenanceObject: true
                },
                data: {
                    date: updatedMaintenanceReportEntry.date,
                    maintainer: updatedMaintenanceReportEntry.maintainer,
                    maintenanceObjectId: updatedMaintenanceReportEntry.maintenanceObjectId,

                }
            })
            .then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Report Entry could not be updated: ${updatedMaintenanceReportEntry.id}`));

            }).catch(error => {
                reject(error);
            });
        });
    }

    deleteMaintenanceReportEntry(_prisma:PrismaClient, id: string): Promise<MaintenanceReportEntry> {

        return new Promise<MaintenanceReportEntry>((resolve, reject) => {
            _prisma.maintenanceReportEntry.delete({
                where: {
                    id:id
                },
                include: {
                    maintenanceObject: true
                }
            }).then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = MaintenanceReportEntryPrismaRepository.mapReportEntryFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Objects could not be deleted: ${id} `));

            }).catch(error => {
                reject(error);
            });
        });
    }
 

    public static mapReportEntryFromPrisma(dbMaintenanceReport: MaintenanceReportEntryFull): MaintenanceReportEntry {
        let reportEntry: MaintenanceReportEntry = {
            id: dbMaintenanceReport.id,
            date: dbMaintenanceReport.date,
            maintainer: dbMaintenanceReport.maintainer,
            maintenanceObject: dbMaintenanceReport.maintenanceObject.name,
            maintenanceObjectId: dbMaintenanceReport.maintenanceObjectId,
            maintenanceReportId: dbMaintenanceReport.maintenanceReportId
        }

        return reportEntry;
    }


}