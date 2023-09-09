import "reflect-metadata";
import dotenv from 'dotenv';
import express, {NextFunction, Request, Response} from "express";
import compression from "compression";

import ApiMaintenanceObject from "../routes/maintenance-object.routes";
import ApiMaintenanceReport from "../routes/maintenance-report.routes";
import { buildSchema } from "type-graphql";

import { PrismaClient } from "@prisma/client";
import Authentication from "../routes/auth.routes";



dotenv.config({path: __dirname+ "/.env"});
console.log(__dirname)

const app = express();

app.use(express.json());
app.use(compression());


const maintenanceObject = new ApiMaintenanceObject();
const maintenanceReport = new ApiMaintenanceReport();
const auth = new Authentication();

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL+"Tenant1" }}});

app.use('/', maintenanceObject.router);
app.use('/', maintenanceReport.router);
app.use('/', auth.router);

// const prisma = ;

const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, () => {

    if(server) {
        console.log(`Server is running on port ${port}`);
    }

});
