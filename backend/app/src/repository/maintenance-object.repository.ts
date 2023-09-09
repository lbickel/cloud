import { PrismaClient } from "@prisma/client";

export interface MaintenanceObject {
    id: string,
    name: string,
}

export interface MaintenanceObjectRepository {

    allMaintenanceObjects(_prisma: PrismaClient): Promise<MaintenanceObject[]>;

    findMaintenanceObjectById(_prisma: PrismaClient, id: string):Promise<MaintenanceObject>;

}