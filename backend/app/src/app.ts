import "reflect-metadata";
import express from "express";
import compression from "compression";

import ApiMaintenanceObject from "../routes/maintenance-object.routes";
import ApiMaintenanceReport from "../routes/maintenance-report.routes";


import Authentication from "../routes/auth.routes";

console.log(__dirname)

const app = express();

app.use(express.json());
app.use(compression());


const maintenanceObject = new ApiMaintenanceObject();
const maintenanceReport = new ApiMaintenanceReport();
const auth = new Authentication();


app.use('/', maintenanceObject.router);
app.use('/', maintenanceReport.router);
app.use('/', auth.router);


const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, () => {

    if(server) {
        console.log(`Server is running on port ${port}`);
    }

});
