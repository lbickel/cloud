import { PrismaClient } from "@prisma/client";
import { isUndefined } from "lodash";
import { singleton } from "tsyringe";
import dotenv from 'dotenv';

@singleton()
export class TenantConnectionResolver {

    private _connectionCache: Map<string, PrismaClient> = new Map();
  

    connectionOfTenant(tenantID: string): Promise<PrismaClient> {

        return new Promise<PrismaClient>((resolve, reject) => {
            this.checkConnectionCache(tenantID)
            .then(cachedConnection => {
                resolve(cachedConnection);
            }).catch(cacheError => {
                console.log(cacheError);
                this.createTenantConnection(tenantID)
                .then(newConnection => {
                    this._connectionCache.set(tenantID, newConnection);
                    resolve(newConnection);
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            });
        });
        
    }

    private checkConnectionCache(tenantID: string): Promise<PrismaClient> {

        return new Promise<PrismaClient>((resolve, reject) => {

            const tenantConnection = this._connectionCache.get(tenantID);

            if(!isUndefined(tenantConnection)) {
                resolve(tenantConnection);
            }

            reject(new Error("no connection in cache"));

        });

    }

    /**
     * TenantID is currently the database name.
     * 
     * @param tenantID 
     * @returns 
     */
    private createTenantConnection(tenantID: string): Promise<PrismaClient> {
        return new Promise<PrismaClient>((resolve, reject) => {

            //TODO: Rework required!!!!
            const tenantConnection = new PrismaClient({ datasources: { db: { url: 'postgresql://postgres:postgres@my-postgres-service:5432/'+tenantID }}});

            if (isUndefined(tenantConnection)) {
                reject(new Error(`No database connection was found for tenant ${tenantID}`));
            }
            
            resolve(tenantConnection);

        });
    }
    


}