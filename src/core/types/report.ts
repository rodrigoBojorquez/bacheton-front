interface CreateReportRequest {

  comment: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: string;

  image?: File;
}
export interface ReportByUser {
  id: string;
  comment: string;
  location: string;
  latitude: number;
  longitude: number;
  resolveDate?: string | null;
  imageUrl: string;
  status: string;
  severity: string;
  createDate: string;
  userId: string;
  userName: string;
  resolvedById?: string | null;
  resolvedByUserName?: string | null;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

export type { CreateReportRequest,ReportByUser, PaginatedResponse }
