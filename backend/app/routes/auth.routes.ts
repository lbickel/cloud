import { container } from "tsyringe";
import { AuthorizationMiddleware } from "../src/authorization.middleware";
import MaintenanceReportController from "../src/controller/maintenance-report.controller";
import { TenantUtils } from "../src/tenant/tenant.utils";
import { ApiRoutesBase } from "./routes";



export default class Authentication extends ApiRoutesBase {

    private _tenantUtils: TenantUtils;

    constructor() {
        super();
        this._tenantUtils = container.resolve(TenantUtils);
        this.initRoutes();
    }

    protected initRoutes(): void {

        this.router.post("/auth", (req, res) => {
            console.log(req.body)
            const { username, password } = req.body;

              // Find the user in the mock database (you should replace this with your own user validation logic)
            const token = AuthorizationMiddleware.authenticate(username, password);
            if (!token) {
                return res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
            }


            // Respond with the JWT
            res.json({ token }); 

        });

    }


}