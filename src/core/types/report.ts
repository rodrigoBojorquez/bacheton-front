 interface CreateReportRequest {

  comment: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: string;

  image?: File;
}

export type { CreateReportRequest }
