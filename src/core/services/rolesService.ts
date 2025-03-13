import type {ListResponse} from "@/core/types/common.ts";
import type {AddRoleRequest, EditRoleRequest, Role} from "@/core/types/role.ts";
import {apiClient} from "@/core/common/configuration/axiosClient.ts";
import {useToastMutation} from "@/core/common/composables/serviceHooks.ts";

export const listRoles = async (page?: number, pageSize?: number, search?: string): Promise<ListResponse<Role>> => {
  return (await apiClient.get('/Roles', {
    params: { ...(page && { page }), ...(pageSize && { pageSize }), ...(search && { search }) }
  })).data;
}


export const getRole = async (id: string): Promise<Role> => {
  return (await apiClient.get(`/Roles/${id}`)).data;
}

const editRole = async (data: EditRoleRequest) => {
  await apiClient.put(`/Roles`, data);
}

const deleteRole = async (id: string) => {
  await apiClient.delete(`/Roles/${id}`);
}

const addRole = async (request: AddRoleRequest) => {
  await apiClient.post(`/Roles`, request);
}


/**
 * Hooks
 */
export function useEditRole() {
  return useToastMutation<void, EditRoleRequest>(
    editRole,
    {
      mutationKey: ["Roles"],
    },
    {
      success: "Rol editado",
    }
  );
}

export function useDeleteRole() {
  return useToastMutation<void, string>(
    deleteRole,
    {
      mutationKey: ["Roles"]
    }, {
      success: "Rol eliminado"
    }
  )
}

export function useAddRole() {
  return useToastMutation<void, AddRoleRequest>(
    addRole,
    {
      mutationKey: ["Roles"]
    }, {
      success: "Rol añadido"
    }
  )
}
