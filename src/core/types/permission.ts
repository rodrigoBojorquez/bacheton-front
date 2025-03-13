interface Permission {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  moduleName: string;
}

interface UpdatePermissionRequest {
  id: string;
  displayName: string;
  icon: string;
}

export type { Permission, UpdatePermissionRequest };
