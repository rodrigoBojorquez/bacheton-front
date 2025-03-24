
import { apiClient } from "@/core/common/configuration/axiosClient.ts";
import type { ReportsSummaryResponse, ReportsSeverityResponse, TopUsersResponse, AverageResolutionTimeResponse } from "@/core/types/dashboard.ts";

/**
 * Obtiene el resumen general de los reportes.
 */
export async function getReportsSummary(): Promise<ReportsSummaryResponse> {
  const { data } = await apiClient.get("/Dashboard/reports-summary");
  return data;
}

/**
 * Obtiene el conteo de reportes por severidad.
 */
export async function getReportsSeverity(): Promise<ReportsSeverityResponse> {
  const { data } = await apiClient.get("/Dashboard/reports-severity");
  return data;
}

/**
 * Obtiene el listado de los usuarios con más reportes.
 */
export async function getTopUsers(): Promise<TopUsersResponse> {
  const { data } = await apiClient.get("/Dashboard/top-users");
  return data;
}

/**
 * Obtiene el promedio de tiempo de resolución de reportes.
 */
export async function getAverageResolutionTime(): Promise<AverageResolutionTimeResponse> {
  const { data } = await apiClient.get("/Dashboard/average-resolution-time");
  return data;
}
