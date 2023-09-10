import { Prisma, PrismaClient, MaintenanceObject as PrismaMaintenanceObject } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceObject, MaintenanceObjectCreation, MaintenanceObjectRepository } from "../../src/repository/maintenance-object.repository";
import { DefaultArgs } from "@prisma/client/runtime/library";

@singleton()
export class MaintenanceObjectPrismaRepository implements MaintenanceObjectRepository {

    allMaintenanceObjects(_prisma: PrismaClient): Promise<MaintenanceObject[]> {

        return new Promise<MaintenanceObject[]>((resolve, reject) => {

            _prisma.maintenanceObject.findMany().then(dbMaintenanceObjects => {
                const result = dbMaintenanceObjects.map(dbMaintenanceObject => this.mapFromPrisma(dbMaintenanceObject));
                
                if(isEmpty(result)) {
                    reject(new Error('No Maintenance Objects'));
                }

                resolve(result);
            }).catch(error => {
                reject(error);
            })
        });
    }

    findMaintenanceObjectById(_prisma: PrismaClient, id: string):Promise<MaintenanceObject> {

        return new Promise<MaintenanceObject>((resolve, reject) => {
            _prisma.maintenanceObject.findUnique({
                where: {
                    id:id
                }
            }).then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = this.mapFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`No Maintenance Objects found for id: ${id}`));

            }).catch(error => {
                reject(error);
            });
        });
    }

    createMaintenanceObject(_prisma: PrismaClient, newMaintenanceObject: MaintenanceObjectCreation): Promise<MaintenanceObject> {
        
        return new Promise<MaintenanceObject>((resolve, reject) => {
            _prisma.maintenanceObject.create({
                data: {
                    name: newMaintenanceObject.name
                }
            })
            .then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = this.mapFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Objects could not be created: ${newMaintenanceObject}`));

            }).catch(error => {
                reject(error);
            });
        });

        
    }

    updateMaintenanceObject(_prisma: PrismaClient, updatedMaintenanceObject: MaintenanceObject): Promise<MaintenanceObject> {
        
        return new Promise<MaintenanceObject>((resolve, reject) => {
            _prisma.maintenanceObject.update({
                where: {
                    id: updatedMaintenanceObject.id
                },
                data: {
                    name: updatedMaintenanceObject.name
                }
            })
            .then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = this.mapFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Objects could not be updated: ${updatedMaintenanceObject.id}, ${updatedMaintenanceObject.name}`));

            }).catch(error => {
                reject(error);
            });
        });
    }

    deleteMaintenanceObject(_prisma: PrismaClient, id: string):Promise<MaintenanceObject> {

        return new Promise<MaintenanceObject>((resolve, reject) => {
            _prisma.maintenanceObject.delete({
                where: {
                    id:id
                }
            }).then(dbMaintenanceObject => {

                if(!isNull(dbMaintenanceObject)) {
                    const maintenanceObject = this.mapFromPrisma(dbMaintenanceObject);
                    resolve(maintenanceObject);
                }

                reject(new Error(`Maintenance Objects could not be deleted: ${id} `));

            }).catch(error => {
                reject(error);
            });
        });
    }
 


    

    private mapFromPrisma(dbMaintenanceObject: PrismaMaintenanceObject): MaintenanceObject {
        let maintenanceObject: MaintenanceObject = {
            id: dbMaintenanceObject.id,
            name: dbMaintenanceObject.name
        }

        return maintenanceObject;
    }


}