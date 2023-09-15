import { PrismaClient } from "@prisma/client";
import { isUndefined } from "lodash";
import { singleton } from "tsyringe";


@singleton()
export class TenantConnectionResolver {

    private _connectionCache: Map<string, unknown> = new Map();
  

    connectionOfTenant(tenantID: string): Promise<unknown> {

        return new Promise<unknown>((resolve, reject) => {
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

    private checkConnectionCache(tenantID: string): Promise<unknown> {

        return new Promise<unknown>((resolve, reject) => {

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
    private createTenantConnection(tenantID: string): Promise<unknown> {
        return new Promise<unknown>((resolve, reject) => {

            //TODO: Rework required!!!!
            const tenantConnection = new PrismaClient().$extends({
                query: {
                    $allOperations({model, operation, args, query}) {
                        args.where = { tenantID: tenantID, ...args.where }
                        return query(args);
                    }
                }
            });

            

            if (isUndefined(tenantConnection)) {
                reject(new Error(`No database connection was found for tenant ${tenantID}`));
            }
            
            resolve(tenantConnection);

        });
    }
    


}