// src/core/services/logsService.ts

import type { LogEntry } from "@/core/types/logs.ts";
import type { ListResponse } from "@/core/types/common.ts";
import { apiClient } from "@/core/common/configuration/axiosClient.ts";


export async function listLogs(): Promise<ListResponse<LogEntry>> {
  const { data } = await apiClient.get("/Logs");
  return data;
}



