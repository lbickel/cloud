import { container } from "tsyringe";
import { AuthorizationMiddleware } from "../src/authorization.middleware";
import { ApiRoutesBase } from "./routes";
import { TenantUtils } from "../src/tenant/tenant.utils";
import { isEmpty } from "lodash";
import MaintenanceReportEntryController from "../src/controller/maintenance-report-entry.controller";


export default class ApiMaintenanceReportEntry extends ApiRoutesBase {

    private _maintenanceReportEntryController: MaintenanceReportEntryController;
    private _tenantUtils: TenantUtils;

    constructor() {
        super();
        this._maintenanceReportEntryController = container.resolve(MaintenanceReportEntryController);
        this._tenantUtils = container.resolve(TenantUtils);
        this.initRoutes();
    }

    protected initRoutes(): void {

        

        this.router.get("/maintenance-report-entry",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportEntryController.getAllMaintenanceReportEntry(tenantID).
                    then(maintenanceReportEntry => {
                        res.status(200).json(maintenanceReportEntry);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.get("/maintenance-report-entry/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportEntryController.findMaintenanceReportEntry(tenantID, id).
                    then(maintenanceReportEntry => {
                        res.status(200).json(maintenanceReportEntry);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.post("/maintenance-report-entry",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const newMaintenanceObject = req.body;

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportEntryController.createMaintenanceReportEntry(tenantID, newMaintenanceObject).
                    then(maintenanceReportEntry => {
                        res.status(200).json(maintenanceReportEntry);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.put("/maintenance-report-entry/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).json("Missing id for maintenance object");
            }

            const newMaintenanceObject = req.body;

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportEntryController.updateMaintenanceReportEntry(tenantID, newMaintenanceObject).
                    then(maintenanceReportEntry => {
                        res.status(200).json(maintenanceReportEntry);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });


        this.router.delete("/maintenance-report-entry/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportEntryController.deleteMaintenanceReportEntry(tenantID, id).
                    then(maintenanceReportEntry => {
                        res.status(200).json(maintenanceReportEntry);

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