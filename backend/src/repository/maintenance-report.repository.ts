
export interface MaintenanceReport {
    id: string,
    entries: MaintenanceReportEntry[],
    year: number
}

export interface MaintenanceReportEntry {
    id: string,
    maintainer: string,
    maintenanceObject: string,
    date: string
}


export interface MaintenanceReportRepository {

    //allMaintenanceReport(): Promise<MaintenanceReport[]>;

    findMaintenanceReportById(dbConnection:any, id: string):Promise<MaintenanceReport>;
    findMaintenanceReportByYear(dbConnection:any, year: number):Promise<MaintenanceReport>;


}