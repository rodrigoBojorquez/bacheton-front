// src/core/services/reportService.ts
import { apiClient } from "@/core/common/configuration/axiosClient.ts";
import { useToastMutation } from "@/core/common/composables/serviceHooks";
import { useMutation } from "@tanstack/vue-query";
import type { CreateReportRequest , ReportByUser, PaginatedResponse} from "../types/report";



export function dataURLToFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}



async function createReport(data: CreateReportRequest): Promise<void> {
  const formData = new FormData();


  formData.append("Comment", data.comment);
  formData.append("Location", data.location);
  formData.append("Latitude", String(data.latitude));
  formData.append("Longitude", String(data.longitude));
  formData.append("Severity", data.severity);

  if (data.image) {
    formData.append("image", data.image);
  }

  await apiClient.post("/Reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getUserReports(page: number, pageSize: number): Promise<PaginatedResponse<Report>> {
  const { data } = await apiClient.get<PaginatedResponse<Report>>("/Reports/user", {
    params: { page, pageSize }
  });
  return data;
}


export function useCreateReport() {
  return useToastMutation<void, CreateReportRequest>(
    createReport,
    {
      mutationKey: ["Reports", "create"],
    },
    {
      success: "Reporte enviado correctamente ✅",
      error: "Ocurrió un error al enviar el reporte ❌",
    }
  );
}
