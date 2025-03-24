import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { refreshToken, showAccess } from '@/core/services/authService.ts'
import { jwtDecode } from 'jwt-decode'
import type { AccessLevel, TokenPayload } from '@/core/types/auth.ts'
import { getUser } from '@/core/services/userService'


export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref<boolean>(false)
  const token = ref<string | null>(null)
  const permissions = ref<string[]>([])
  const accessLevel = ref<AccessLevel | null>(null)

  const userName = ref<string | null>(null)
  const userRole = ref<string | null>(null)
  const decodedUserId = ref<string | null>(null);


  const loading = ref<boolean>(true)

  // Actions
  function setAuth(value: boolean) {
    isAuth.value = value
    loading.value = false
  }

  function setToken(value: string | null) {
    token.value = value;
    loading.value = false;

    if (value) {
      const decoded = jwtDecode<TokenPayload>(value);
      console.log(decoded);
      permissions.value = decoded.permissions ? decoded.permissions.split(',') : [];
      decodedUserId.value = decoded.nameid ?? null;
      fetchUserInfo(decodedUserId.value);
    } else {
      permissions.value = [];
      decodedUserId.value = null;
      userName.value = null;
      userRole.value = null;
    }
  }

  async function fetchUserInfo(id: string) {
    try {
      const user = await getUser(id)
      userName.value = user.name
      userRole.value = user.roleName
    } catch (e) {
      console.error('Error al obtener info del usuario:', e)
    }
  }

  async function refreshUserInfo() {
    if (!token.value) return;

    const decoded = jwtDecode<TokenPayload>(token.value)
    const userId = decoded.nameid

    if (userId) {
      try {
        const user = await getUser(userId)
        userName.value = user.name
        userRole.value = user.roleName
      } catch (e) {
        console.error('Error al refrescar usuario:', e)
      }
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
    setAccessLevel,
    userName,
    userRole,
    decodedUserId,
    refreshUserInfo,
  }
})
