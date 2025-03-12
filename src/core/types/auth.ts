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
  permissions: string
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
  clientPath?: string
}

export type { LoginRequest, RegisterRequest, AuthResponse, TokenPayload, AccessLevel }
