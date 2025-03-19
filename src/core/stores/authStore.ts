import { defineStore } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { refreshToken, showAccess } from '@/core/services/authService.ts'
import { jwtDecode } from 'jwt-decode'
import type { AccessLevel, TokenPayload } from '@/core/types/auth.ts'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref<boolean>(false)
  const token = ref<string | null>(null)
  const permissions = ref<string[]>([])
  const accessLevel = ref<AccessLevel | null>(null)

  const loading = ref<boolean>(true)

  // Actions
  function setAuth(value: boolean) {
    isAuth.value = value
    loading.value = false
  }

  function setToken(value: string | null) {
    token.value = value
    loading.value = false

    if (value) {
      const decoded = jwtDecode<TokenPayload>(value)
      permissions.value = decoded.permissions.split(',')
    }
  }

  function setAccessLevel(value: AccessLevel | null) {
    accessLevel.value = value
    loading.value = false
  }

  onMounted(async () => {
    try {
      await refreshToken()
      await showAccess()
    } catch (e) {
      console.error('Error al refrescar token:', e)
      setAuth(false)
      setToken(null)
    } finally {
      loading.value = false
    }
  })

  return {
    isAuth,
    token,
    permissions,
    accessLevel,
    loading,
    setToken,
    setAuth,
    setAccessLevel
  }
})
