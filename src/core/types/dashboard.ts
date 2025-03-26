// src/core/types/dashboard.ts

export interface ReportsSummaryResponse {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
}

export interface ReportsSeverityResponse {
  totalReports: number;
  lowSeverity: number;
  mediumSeverity: number;
  highSeverity: number;
}

export interface TopUser {
  id: string;
  name: string;
  email: string;
  reportsCount: number;
}

export type TopUsersResponse = TopUser[];

export interface AverageResolutionTimeResponse {
  averageDays: number;
}

