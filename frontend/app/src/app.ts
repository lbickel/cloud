import "reflect-metadata";
import express from "express";
import compression from "compression";

import path from 'path';
import { v4 } from "uuid";

const app = express();
const uuid = v4();

app.use(express.json());
app.use(compression());
const pathToStatic = path.join(__dirname, '/../web');
// Custom middleware for logging served files
app.use((req, res, next) => {
    console.log(`File ${req.url} served by frontend: ${uuid}`)
    next();
});

app.use(express.static(pathToStatic))


const port = process.env.SERVER_PORT || 4000;

const server = app.listen(port, () => {

    if(server) {
        console.log(`Frontend Web Server is running on port ${port}`);
    }

});
