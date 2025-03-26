import { useAuthStore } from '@/core/stores/authStore.ts'
import type { AccessLevel, MenuItem, PermissionToRouteMap } from '@/core/types/auth.ts'

export function isSuperAdmin() {
  const store = useAuthStore()
  const permissions = store.permissions

  return permissions.includes('superAdmin')
}

export function mapPermissionsToMenu(
  permissionToRouteMap: PermissionToRouteMap,
  accessLevel: AccessLevel,
): MenuItem[] {
  if (!accessLevel || !accessLevel.modules) return []

  return Object.entries(permissionToRouteMap)
    .map(([parentLabel, { links }]) => {
      const filteredLinks = links.filter((link) => {
        const userModule = accessLevel.modules.find((m) => m.name === link.module)
        return (
          userModule &&
          link.permissions.some((p) => userModule.permissions.map((up) => up.name).includes(p))
        )
      })

      if (filteredLinks.length === 0) return null

      return {
        name: parentLabel,
        items: filteredLinks.map((link) => ({
          name: link.name,
          icon: link.icon,
          link: link.route,
        })),
      } as MenuItem
    })
    .filter((item): item is MenuItem => item !== null)
}

export const permissionToRouteMapForPanel: PermissionToRouteMap = {
  "Inicio": {
    links: [
      {
        module: 'Administracion',
        permissions: ['superAdmin'],
        icon: 'pi pi-fw pi-home',
        name: 'Dashboard',
        route: '/admin/dashboard',
      },
    ],
  },
  "Administracion": {
    links: [
      {
        module: 'Administracion',
        permissions: ['logs'],
        name: 'Logs',
        route: '/admin/logs',
        icon: 'pi pi-fw pi-list',
      },
    ],
  },
  'Gestion de Usuarios': {
    links: [
      {
        module: 'Usuarios',
        permissions: ['read'],
        name: 'Usuarios',
        route: '/admin/users',
        icon: 'pi pi-fw pi-users',
      },
      {
        module: 'Roles',
        permissions: ['read'],
        name: 'Roles',
        route: '/admin/roles',
        icon: 'pi pi-fw pi-id-card',
      },
      {
        module: 'Permisos',
        permissions: ['read'],
        name: 'Permisos',
        route: '/admin/permissions',
        icon: 'pi pi-fw pi-lock',
      },
    ],
  },
  "Reportes": {
    links: [
      {
        module: 'Reportes',
        permissions: ['read'],
        name: 'Reportes',
        route: '/admin/reports',
        icon: 'pi pi-fw pi-chart-bar',
      },
      {
        module: 'Reportes',
        permissions: ['monitoring', 'read'],
        name: 'Mapa',
        route: '/app/map',
        icon: 'pi pi-fw pi-map',
      },
    ],
  },
}

const permissionToRouteMapForApp: PermissionToRouteMap = {

}