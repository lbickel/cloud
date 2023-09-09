import { container, singleton } from "tsyringe";
import { MaintenanceObjectPrismaRepository } from "../../prisma/repository/maintenance-object.prisma.repository";
import { MaintenanceObject, MaintenanceObjectRepository } from "../repository/maintenance-object.repository";
import { TenantConnectionResolver } from "../../prisma/tenant/connector.tenant.prisma";


@singleton()
export default class MaintenanceObjectController {

    private _maintenanceObjectRepository: MaintenanceObjectRepository;
    private _tenantConnectionResolver: TenantConnectionResolver;


    constructor() {
        this._maintenanceObjectRepository = container.resolve(MaintenanceObjectPrismaRepository);
        this._tenantConnectionResolver = container.resolve(TenantConnectionResolver);
    }

    public async findMaintenanceObjectById(tenantId: string, id: string): Promise<MaintenanceObject> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceObjectRepository.findMaintenanceObjectById(tenantConnection, id);
    }

}