import { Router } from "express";

export abstract class ApiRoutesBase {

    protected _router: Router;
    
    constructor() {
        this._router = Router();
    }

    public get router():Router {
        return this._router;
    }

    protected abstract initRoutes(): void;

}