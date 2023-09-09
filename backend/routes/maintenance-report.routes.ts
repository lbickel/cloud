import { container } from "tsyringe";
import { AuthorizationMiddleware } from "../src/authorization.middleware";
import MaintenanceReportController from "../src/controller/maintenance-report.controller";
import { TenantUtils } from "../src/tenant/tenant.utils";
import { ApiRoutesBase } from "./routes";


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

        this.router.get("/maintenance-report/:year", AuthorizationMiddleware.authenticateToken, AuthorizationMiddleware.authorize, (req, res) => {

            const year = Number.parseInt(req.params.year);

            console.log(`year ${year}`);

            if (year == null) {
                res.status(400).send();
            }

            this._tenantUtils.getTenantIdFromResponse(res)
            .then(tenantID => {

                this._maintenanceReportController.findMaintenanceReportByYear(tenantID, year).
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

    }


}