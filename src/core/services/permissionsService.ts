import type {ListResponse} from "@/core/types/common.ts";
import type {Permission, UpdatePermissionRequest} from "@/core/types/permission.ts";
import {apiClient} from "@/core/common/configuration/axiosClient.ts";
import { useToastMutation } from "../common/composables/serviceHooks";


export async function listPermissions(search?: string, roleId?: string): Promise<ListResponse<Permission>> {
  const { data } = await apiClient.get("/Permissions", {
    params: { ...(search && { search }), ...(roleId && { roleId }) }
  });
  return data;
}

const updatePermission = async (data: UpdatePermissionRequest) => {
  await apiClient.put(`/Permissions`, data);
};

export function useEditPermission() {
  return useToastMutation<void, UpdatePermissionRequest>(
    updatePermission,
    {
      mutationKey: ["Permissions"],
    },
    {
      success: "Permiso editado correctamente ✅",
    }
  );
}


