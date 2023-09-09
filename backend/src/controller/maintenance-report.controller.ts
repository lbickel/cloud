import { container, singleton } from "tsyringe";
import { MaintenanceReportPrismaRepository } from "../../prisma/repository/maintenance-report.prisma.repository";
import { TenantConnectionResolver } from "../../prisma/tenant/connector.tenant.prisma";
import { MaintenanceReport, MaintenanceReportRepository } from "../repository/maintenance-report.repository";


@singleton()
export default class MaintenanceReportController {

    private _maintenanceReportRepository: MaintenanceReportRepository;
    private _tenantConnectionResolver: TenantConnectionResolver;


    constructor() {
        this._maintenanceReportRepository = container.resolve(MaintenanceReportPrismaRepository);
        this._tenantConnectionResolver = container.resolve(TenantConnectionResolver);
    }

    public async findMaintenanceReportById(tenantId: string, id: string): Promise<MaintenanceReport> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);

        return this._maintenanceReportRepository.findMaintenanceReportById(tenantConnection, id);
    }

    public async findMaintenanceReportByYear(tenantId: string, year: number): Promise<MaintenanceReport> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportRepository.findMaintenanceReportByYear(tenantConnection, year);
    }

}