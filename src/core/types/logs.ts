// src/core/types/logs.ts

export interface LogEntry {
  id: string;
  timestamp: string; // ISO 8601 format
  endpoint: string;
  status: string | null;
  traceId: string;
  duration: string | null;
  userId: string;
  level: "Information" | "Warning" | "Error" | string;
  method: string | null;
}

// Si quieres soportar paginación en el futuro:
export interface LogsResponse {
  items: LogEntry[];
  totalCount: number;
}
