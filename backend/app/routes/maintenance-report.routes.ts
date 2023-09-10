import { container } from "tsyringe";
import { AuthorizationMiddleware } from "../src/authorization.middleware";
import MaintenanceReportController from "../src/controller/maintenance-report.controller";
import { TenantUtils } from "../src/tenant/tenant.utils";
import { ApiRoutesBase } from "./routes";
import { isEmpty } from "lodash";


export default class ApiMaintenanceReport extends ApiRoutesBase {

    private _maintenanceReportController: MaintenanceReportController;
    private _tenantUtils: TenantUtils;

    constructor() {
        super();
        this._maintenanceReportController = container.resolve(MaintenanceReportController);
        this._tenantUtils = container.resolve(TenantUtils);
        this.initRoutes();
    }

    protected initRoutes(): void {

        this.router.get("/maintenance-report", AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {
            const yearQuery= req.query.year as string;
            let year: number = NaN;
            
            if (yearQuery !== null) {
                year = Number.parseInt(yearQuery);

            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {


                if(Number.isNaN(year)) {
                    this._maintenanceReportController.getAllMaintenanceReports(tenantID).
                    then(report => {
                        res.status(200).json(report);
    
                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });

                }else {
                    this._maintenanceReportController.findMaintenanceReportByYear(tenantID, year).
                    then(report => {
                        res.status(200).json(report);
    
                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
                }



            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

 
        this.router.get("/maintenance-report/:id", AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportController.findMaintenanceReportById(tenantID, id).
                then(report => {
                    res.status(200).json(report);

                }).catch(error => {
                    console.error(error);
                    res.status(404).send();
                });


            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.post("/maintenance-report",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const newMaintenanceReport = req.body;

            // if(isEmpty(newMaintenanceReport)) {
            //     res.status(400).json("Name of new maintenance object must not be empty or undefined");
            // }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportController.createMaintenanceReport(tenantID, newMaintenanceReport).
                    then(maintenanceReport => {
                        res.status(200).json(maintenanceReport);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });

        this.router.put("/maintenance-report/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            const updatedMaintenanceReport = req.body;

            // if(isEmpty(updatedMaintenanceReport)) {
            //     res.status(400).json("Name of new maintenance object must not be empty or undefined");
            // }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportController.updateMaintenanceReport(tenantID, updatedMaintenanceReport).
                    then(maintenanceReport => {
                        res.status(200).json(maintenanceReport);

                    }).catch(error => {
                        console.error(error);
                        res.status(404).send();
                    });
            }).catch(error => {
                console.error(error);
                res.sendStatus(400);

            });

        });


        this.router.delete("/maintenance-report/:id",  AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const id = req.params.id;

            if (id == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportController.deleteMaintenanceReport(tenantID, id).
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