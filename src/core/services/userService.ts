  import type {ListResponse} from "@/core/types/common.ts";
  import type {AddUserRequest, EditUserRequest, User} from "@/core/types/user.ts";
  import {apiClient} from "@/core/common/configuration/axiosClient.ts";
  import {useToastMutation} from "@/core/common/composables/serviceHooks.ts";

  /**
   * Peticiones
   */

  export async function listUsers(page?: number, pageSize?: number, search?: string): Promise<ListResponse<User>> {
    const {data} = await apiClient.get('/Users', {
      params: { ...(page && { page }), ...(pageSize && { pageSize }), ...(search && { search }) }
    });
    return data;
  }

  export const getUser = async (id: string) : Promise<User> => {
    return (await apiClient.get(`/Users/${id}`)).data
  }

  const editUser = async (data: EditUserRequest) => {
    await apiClient.put(`/Users`, data);
  };

  const deleteUser = async(id: string) => {
    await apiClient.delete(`/Users/${id}`)
  }

  const addUser = async (request: AddUserRequest) => {
    await apiClient.post(`/Users`, request)
  }


  /**
   * Hooks
   */
  export function useEditUser() {
    return useToastMutation<void, EditUserRequest>(
      editUser,
      {
        mutationKey: ["Users"],
      },
      {
        success: "Usuario editado",
      }
    );
  }

  export function useDeleteUser() {
    return useToastMutation<void, string>(
      deleteUser,
      {
        mutationKey: ["Users"]
      }, {
        success: "Usuario eliminado"
      }
    )
  }

  export function useAddUser() {
    return useToastMutation<void, AddUserRequest>(
      addUser,
      {
        mutationKey: ["Users"]
      }, {
        success: "Usuario creado 😃"
      }
    )
  }
