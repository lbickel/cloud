import { PrismaClient } from "@prisma/client";

export interface MaintenanceObject {
    id: string,
    name: string,
}

export interface MaintenanceObjectCreation {
    name: string
}

export interface MaintenanceObjectRepository {

    allMaintenanceObjects(_prisma: PrismaClient): Promise<MaintenanceObject[]>;

    findMaintenanceObjectById(_prisma: PrismaClient, id: string): Promise<MaintenanceObject>;

    createMaintenanceObject(_prisma: PrismaClient, newMaintenanceObject: MaintenanceObjectCreation, tenantID: string): Promise<MaintenanceObject>;
    
    updateMaintenanceObject(_prisma: PrismaClient, updatedMaintenanceObject: MaintenanceObject): Promise<MaintenanceObject>;
    
    deleteMaintenanceObject(_prisma: PrismaClient, id: string): Promise<MaintenanceObject>;

}