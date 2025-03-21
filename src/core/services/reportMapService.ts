import type { ListResponse } from "@/core/types/common.ts";
import type {
    MonitoringReportsRequest,
    ListUserReportsRequest,
    Report,
    UpdateReportRequest
} from "@/core/types/reportMap";
import { apiClient } from "@/core/common/configuration/axiosClient.ts";
import { useToastMutation } from "@/core/common/composables/serviceHooks.ts";

/**
 * Peticiones
 */
export async function listMonitoringReports(request: MonitoringReportsRequest = {}): Promise<ListResponse<Report>> {
    const { data } = await apiClient.get('/Reports/monitoring', { params: request });
    return data;
}

export async function listUserReports(request: ListUserReportsRequest = {}): Promise<ListResponse<Report>> {
    const { data } = await apiClient.get('/Reports/user', { params: request });
    return data;
}

export async function getReport(id: string): Promise<Report> {
    return (await apiClient.get(`/Reports/${id}`)).data;
}

export async function updateReport(request: UpdateReportRequest): Promise<Report> {
    return (await apiClient.put('/Reports', request)).data;
}

export async function deleteReport(id: string): Promise<void> {
    await apiClient.delete(`/Reports/${id}`);
}

/**
 * Hooks
 */
export function useUpdateReport() {
    return useToastMutation<Report, UpdateReportRequest>(
        updateReport,
        {
            mutationKey: ["Reports"],
        },
        {
            success: "Reporte actualizado exitosamente",
        }
    );
}

export function useDeleteReport() {
    return useToastMutation<void, string>(
        deleteReport,
        {
            mutationKey: ["Reports"],
        },
        {
            success: "Reporte eliminado exitosamente",
        }
    );
}