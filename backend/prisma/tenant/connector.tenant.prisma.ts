import { PrismaClient } from "@prisma/client";
import { isUndefined } from "lodash";
import { singleton } from "tsyringe";
import dotenv from 'dotenv';

@singleton()
export class TenantConnectionResolver {

    private _connectionCache: Map<string, PrismaClient> = new Map();
  

    connectionOfTenant(tenantID: string): Promise<PrismaClient> {

        return new Promise<PrismaClient>((resolve, reject) => {
            this.checkConncetionCache(tenantID)
            .then(cachedConnection => {
                resolve(cachedConnection);
            }).catch(cachError => {
                console.log(cachError);
                this.createTenantConnection(tenantID)
                .then(newConnection => {
                    this._connectionCache.set(tenantID, newConnection);
                    resolve(newConnection);
                }).catch(error => {
                    console.error(error);
                    reject();
                });
            });
        });
        
    }

    private checkConncetionCache(tenantID: string): Promise<PrismaClient> {

        return new Promise<PrismaClient>((resolve, reject) => {

            const tenantConnection = this._connectionCache.get(tenantID);

            if(!isUndefined(tenantConnection)) {
                resolve(tenantConnection);
            }

            reject();

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
            const tenantConnection = new PrismaClient({ datasources: { db: { url: 'my-postgres-service'+tenantID }}});

            // console.log(tenantConnection);

            if (isUndefined(tenantConnection)) {
                reject();
            }
            
            resolve(tenantConnection);

        });
    }
    


}