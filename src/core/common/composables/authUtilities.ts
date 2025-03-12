import { useAuthStore } from '@/core/stores/authStore.ts'

export function isSuperAdmin() {
  const store = useAuthStore()
  const permissions = store.permissions

  return permissions.includes('superAdmin')
}

export function mapPermissionsToRoutes(permissions: string[]) {
  const routes = {
    admin: [{}],
  }
}
