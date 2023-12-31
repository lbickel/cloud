import "reflect-metadata";
import express, { Request, Response } from "express";
import compression from "compression";
import { container, singleton } from "tsyringe";
import prom from "prom-client";

import ApiMaintenanceObject from "../routes/maintenance-object.routes";
import ApiMaintenanceReport from "../routes/maintenance-report.routes";


import Authentication from "../routes/auth.routes";
import ApiMaintenanceReportEntry from "../routes/maintenance-report-entry.routes";
import { TenantConnectionResolver } from "../prisma/tenant/connector.tenant.prisma";
import { v4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const register = new prom.Registry()
prom.collectDefaultMetrics({ register })
const uuid = v4();

const app = express();

app.use(express.json());
app.use(compression());
app.use((req, res, next) => {
  console.log(`Request ${req.url} served by backend: ${uuid}`)
  next();
});


let _tenantConnectionResolver = container.resolve(TenantConnectionResolver);

app.get('/api/metrics', async (_req, res: Response) => {
  const tenant1Prisma = await _tenantConnectionResolver.connectionOfTenant("tenant1") as PrismaClient;
  const tenant2Prisma = await _tenantConnectionResolver.connectionOfTenant("tenant2") as PrismaClient;

  let metrics1 = await tenant1Prisma.$metrics.prometheus({globalLabels: {tenant: "tenant1"}});
  let metrics2 = await tenant2Prisma.$metrics.prometheus({globalLabels: {tenant: "tenant2"}});
  let appMetrics = await register.metrics()

  res.end(metrics1+metrics2+appMetrics)
})


const maintenanceObject = new ApiMaintenanceObject();
const maintenanceReport = new ApiMaintenanceReport();
const maintenanceReportEntry = new ApiMaintenanceReportEntry();
const auth = new Authentication();


app.use('/api', maintenanceObject.router);
app.use('/api', maintenanceReport.router);
app.use('/api', maintenanceReportEntry.router);
app.use('/api', auth.router);


const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, () => {

    if(server) {
        console.log(`Server is running on port ${port}`);
    }

});
