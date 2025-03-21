// Estado del reporte 
export type ReportStatus = "Pending" | "InProgress" | "Resolved";

// Severidad del Reporte
export type ReportSeverity = "Low" | "Medium" | "High";

export interface MonitoringReportsRequest {
    page?: number;
    pageSize?: number;
    reportStatus?: ReportStatus | null;
    reportSeverity?: ReportSeverity | null;
    resolvedById?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    radiusKm?: number | null;
}

export interface ListUserReportsRequest {
    page?: number;
    pageSize?: number;
}

export interface UpdateReportRequest {
    id: string;
    comment: string;
    severity: ReportSeverity;
    status: ReportStatus;
}

export interface Report {
    id: string;
    comment: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: ReportSeverity;
    status: ReportStatus;
    resolvedById?: string;
    resolvedBy?: string;
    imageUrl?: string;
    createDate: string;
    // createdAt: string;
    updatedAt: string;
}