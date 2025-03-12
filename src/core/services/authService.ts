import {apiClient} from "@/core/common/configuration/axiosClient.ts";
import type {
  AccessLevel,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@/core/types/auth.ts'
import {useToastMutation} from "@/core/common/composables/serviceHooks.ts";
import {useMutation} from "@tanstack/vue-query";
import {useAuthStore} from "@/core/stores/authStore.ts"

const loginUser = async (request: LoginRequest): Promise<AuthResponse> => {
  const {data} = await apiClient.post('/Auth/login', request)
  return data
}

const registerUser = async (request: RegisterRequest): Promise<AuthResponse> => {
  const {data} = await apiClient.post('/Auth/register', request)
  return data
}

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const res = await apiClient.post<AuthResponse>('/Auth/refresh-token')

    const store = useAuthStore()
    store.setAuth(true)
    store.setToken(res.data.token)

    return res.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const showAccess = async (): Promise<AccessLevel> => {
  try {
    const res = await apiClient.post<AccessLevel>('/Auth/show-access')
    return res.data
  }
  catch (e) {
    console.error(e)
    throw e
  }
}

const logout = async () => {
  await apiClient.post('/Auth/logout')
}

export function useLogin() {
  return useToastMutation<AuthResponse, LoginRequest>(loginUser, {
    mutationKey: ["Auth", "login"]
  }, {
    loading: "Iniciando sesión ⏳",
    success: "Hola de nuevo! 😃",
  })
}

export function useRefreshToken() {
  const store = useAuthStore()

  return useMutation({
    mutationFn: refreshToken,
    mutationKey: ["Auth", "refresh-token"],
    onSuccess: (res) => {
      store.setAuth(true)
      store.setToken(res.token)
    },
    onError: (err) => {
      console.error(err)
      store.setToken(null)
      store.setAuth(false)
    }
  })
}

export function useRegister() {
  return useToastMutation<AuthResponse, RegisterRequest>(registerUser, {
    mutationKey: ["Auth", "register"]
  }, {
    success: "Bienvenido! 😃",
  })
}

export function useLogout() {
  return useToastMutation<void, void>(logout, {
    mutationKey: ["Auth", "logout"]
  }, {
    loading: "Cerrando sesión ⏳",
    success: "Hasta luego! 🫡",
  })
}
