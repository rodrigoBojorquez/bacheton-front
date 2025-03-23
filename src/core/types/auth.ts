import type {JwtPayload} from "jwt-decode";

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  token: string
}

interface TokenPayload extends JwtPayload {
  name: string
  role: string
  permissions: string
  nameid: string
}


interface AccessLevel {
  modules: ModuleAccess[]
  rootPath: string
}

interface ModuleAccess {
  name: string
  icon?: string
  permissions: PermissionPolicy[]
}

interface PermissionPolicy {
  name: string
  displayName: string
  clientPath?: string
}


interface PermissionToRouteMap {
  [key: string]: MenuSection;
}

interface MenuSection {
  links: Link[];
}

interface Link {
  module: string;
  permissions: string[];
  icon: string;
  name: string;
  route: string;
}

interface MenuItem {
  name: string;
  icon?: string;
  link?: string;
  items?: MenuItem[];
  class?: string
  command?: (args: { originalEvent: MouseEvent; item: MenuItem }) => void;
}

export type { LoginRequest, RegisterRequest, AuthResponse, TokenPayload, AccessLevel, MenuItem, PermissionToRouteMap };
