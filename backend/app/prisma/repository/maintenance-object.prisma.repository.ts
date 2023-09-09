import { PrismaClient, MaintenanceObject as PrismaMaintenanceObject } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceObject, MaintenanceObjectRepository } from "../../src/repository/maintenance-object.repository";

@singleton()
export class MaintenanceObjectPrismaRepository implements MaintenanceObjectRepository {

    

    constructor() {
        
    }

    allMaintenanceObjects(_prisma: PrismaClient): Promise<MaintenanceObject[]> {

        return new Promise((resolve, reject) => {

            _prisma.maintenanceObject.findMany().then(dbMaintenanceObjects => {
                const result = dbMaintenanceObjects.map(dbMobject => this.mapFromPrisma(dbMobject));
                
                if(isEmpty(result)) {
                    reject('found nothing');
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

                reject('not found');

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