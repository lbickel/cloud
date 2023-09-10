import { PrismaClient, MaintenanceObject as PrismaMaintenanceObject } from "@prisma/client";
import { isEmpty, isNull } from "lodash";
import { singleton } from "tsyringe";
import { MaintenanceObject, MaintenanceObjectRepository } from "../../src/repository/maintenance-object.repository";

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

    private mapFromPrisma(dbMaintenanceObject: PrismaMaintenanceObject): MaintenanceObject {
        let maintenanceObject: MaintenanceObject = {
            id: dbMaintenanceObject.id,
            name: dbMaintenanceObject.name
        }

        return maintenanceObject;
    }


}