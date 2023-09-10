import { container, singleton } from "tsyringe";
import { TenantConnectionResolver } from "../../prisma/tenant/connector.tenant.prisma";
import { MaintenanceReportEntry, MaintenanceReportEntryCreation, MaintenanceReportEntryRepository } from "../repository/maintenance-report-entry.repository";
import { MaintenanceReportEntryPrismaRepository } from "../../prisma/repository/maintenance-report-entry.prisma.repository";



@singleton()
export default class MaintenanceReportEntryController {

    private _maintenanceReportEntryRepository: MaintenanceReportEntryRepository;
    private _tenantConnectionResolver: TenantConnectionResolver;


    constructor() {
        this._maintenanceReportEntryRepository = container.resolve(MaintenanceReportEntryPrismaRepository);
        this._tenantConnectionResolver = container.resolve(TenantConnectionResolver);
    }

    public async findMaintenanceReportEntry(tenantId: string, id: string): Promise<MaintenanceReportEntry> {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportEntryRepository.findMaintenanceReportEntryById(tenantConnection, id);
    }

    public async getAllMaintenanceReportEntry(tenantId: string) {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportEntryRepository.allMaintenanceReportEntries(tenantConnection);

    }

    public async createMaintenanceReportEntry(tenantId: string, newMaintenanceReportEntry: MaintenanceReportEntryCreation) {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportEntryRepository.createMaintenanceReportEntry(tenantConnection, newMaintenanceReportEntry);
    }

    public async updateMaintenanceReportEntry(tenantId: string, updatedMaintenanceReportEntry: MaintenanceReportEntry) {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportEntryRepository.updateMaintenanceReportEntry(tenantConnection, updatedMaintenanceReportEntry);
    }

    public async deleteMaintenanceReportEntry(tenantId: string, id: string) {
        const tenantConnection = await this._tenantConnectionResolver.connectionOfTenant(tenantId);
        return this._maintenanceReportEntryRepository.deleteMaintenanceReportEntry(tenantConnection, id);
    }



}