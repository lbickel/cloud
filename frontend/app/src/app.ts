import "reflect-metadata";
import express from "express";
import compression from "compression";

import path from 'path';
import fs from 'fs';

const app = express();

app.use(express.json());
app.use(compression());
const pathToStatic = path.join(__dirname, '../../web');
console.log(pathToStatic);

app.use(express.static(pathToStatic))

const port = process.env.SERVER_PORT || 4000;

const server = app.listen(port, () => {

    if(server) {
        console.log(`Frontend Web Server is running on port ${port}`);
    }

});
