import { container } from "tsyringe";
import { AuthorizationMiddleware } from "../src/authorization.middleware";
import MaintenanceObjectController from "../src/controller/maintenance-object.controller";
import { ApiRoutesBase } from "./routes";
import { TenantUtils } from "../src/tenant/tenant.utils";


export default class ApiMaintenanceObject extends ApiRoutesBase {

    private _maintenanceObjectController: MaintenanceObjectController;
    private _tenantUtils: TenantUtils;

    constructor() {
        super();
        this._maintenanceObjectController = container.resolve(MaintenanceObjectController);
        this._tenantUtils = container.resolve(TenantUtils);
        this.initRoutes();
    }

    protected initRoutes(): void {

        

        this.router.get("/maintenance-object",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceObjectController.getAllMaintenanceObjects(tenantID).
                    then(maintenanceObjects => {
                        res.status(200).json(maintenanceObjects);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.get("/maintenance-object/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceObjectController.findMaintenanceObjectById(tenantID, id).
                    then(maintenanceObject => {
                        res.status(200).json(maintenanceObject);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });




    }


}