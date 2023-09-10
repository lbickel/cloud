import { container, singleton } from "tsyringe";
import { MaintenanceReportPrismaRepository } from "../../prisma/repository/maintenance-report.prisma.repository";
import { TenantConnectionResolver } from "../../prisma/tenant/connector.tenant.prisma";
import { MaintenanceReport, MaintenanceReportCreation, MaintenanceReportRepository } from "../repository/maintenance-report.repository";


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
    
    public async getAllMaintenanceReports(tenantId: string): Promise<MaintenanceReport[]> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportRepository.allMaintenanceReports(tenantConnection);
    }

    public async createMaintenanceReport(tenantId: string, newReport: MaintenanceReportCreation): Promise<MaintenanceReport> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportRepository.createMaintenanceReport(tenantConnection, newReport);
    }

    public async updateMaintenanceReport(tenantId: string, newReport: MaintenanceReport): Promise<MaintenanceReport> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportRepository.updateMaintenanceReport(tenantConnection, newReport);
    }
    
    public async deleteMaintenanceReport(tenantId: string, id: string): Promise<MaintenanceReport> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportRepository.deleteMaintenanceReport(tenantConnection, id);
    }
}