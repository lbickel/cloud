import { NextFunction, Request, Response } from "express";
import { isUndefined } from "lodash";
import { singleton } from "tsyringe";

@singleton()
export class TenantUtils {


    public getTenantIdFromRequest(request:Request): Promise<string> {
      
        return new Promise<string>((resolve, reject) => {
            const tenantID = request.headers['x-tenant-id'] as string | undefined;
            if(!isUndefined(tenantID)) {
                resolve(tenantID);                
            }
           
            reject('no tenant id provided');

        });

    }

    public getTenantIdFromResponse(response:Response): Promise<string> {
      
        return new Promise<string>((resolve, reject) => {
            const tenantID = response.locals.tenant;

            if(!isUndefined(tenantID)) {
                resolve(tenantID);                
            }
           
            reject('no tenant id provided');

        });

    }


}