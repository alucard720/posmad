import { UserRole } from "../types/User"

// Role UUIDs as provided by the API
export const ROLES = {
  ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  USER: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  CAJERO: "7c9e6679-7425-40de-944b-e07fc1f907c9",
  ALMACENISTA: "7c9e6679-7425-40de-944b-e07fc1f907ca",
  PROPIETARIO: "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const

// Mapping from UUID to role code
export const roleUuidToCode = {
  "f47ac10b-58cc-4372-a567-0e02b2c3d479": "ADMIN",
  "7c9e6679-7425-40de-944b-e07fc1f90ae7": "USER",
  "7c9e6679-7425-40de-944b-e07fc1f907c9": "CAJERO",
  "7c9e6679-7425-40de-944b-e07fc1f907ca": "ALMACENISTA",
  "7c9e6679-7425-40de-944b-e07fc1f907cb": "PROPIETARIO",
} as const

// Mapping from role code to UUID
export const roleCodeToUuid = {
  ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  USER: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  CAJERO: "7c9e6679-7425-40de-944b-e07fc1f907c9",
  ALMACENISTA: "7c9e6679-7425-40de-944b-e07fc1f907ca",
  PROPIETARIO: "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const

// Role configuration with permissions and metadata
export const roleConfig = {
  [UserRole.propietario]: {
    uuid: ROLES.PROPIETARIO,
    code: "PROPIETARIO",
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    badgeColor: "danger",
    permissions: [
      "dashboard",
      "productos",
      "pedidos",
      "clientes",
      "transacciones",
      "finanzas",
      "estadisticas",
      "usuarios",
      "configuraciones",
      "catalogo",
      "almacen",
    ],
    canManage: [UserRole.admin, UserRole.almacenista, UserRole.cajero, UserRole.user],
    priority: 5, // Highest priority
  },
  [UserRole.admin]: {
    uuid: ROLES.ADMIN,
    code: "ADMIN",
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    badgeColor: "primary",
    permissions: [
      "dashboard",
      "productos",
      "pedidos",
      "clientes",
      "transacciones",
      "estadisticas",
      "usuarios",
      "configuraciones",
      "catalogo",
      "almacen",
    ],
    canManage: [UserRole.almacenista, UserRole.cajero, UserRole.user],
    priority: 4,
  },
  [UserRole.almacenista]: {
    uuid: ROLES.ALMACENISTA,
    code: "ALMACENISTA",
    label: "Almacenista",
    description: "Acceso a gestión de productos, inventario y almacén.",
    badgeColor: "warning",
    permissions: ["dashboard", "productos", "pedidos", "almacen", "clientes"],
    canManage: [],
    priority: 3,
  },
  [UserRole.cajero]: {
    uuid: ROLES.CAJERO,
    code: "CAJERO",
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    badgeColor: "success",
    permissions: ["dashboard", "pedidos", "clientes"],
    canManage: [],
    priority: 2,
  },
  [UserRole.user]: {
    uuid: ROLES.USER,
    code: "USER",
    label: "Usuario",
    description: "Acceso básico al sistema.",
    badgeColor: "secondary",
    permissions: ["dashboard"],
    canManage: [],
    priority: 1, // Lowest priority
  },
} as const

// Helper functions for role management

/**
 * Convert UUID from API to internal UserRole enum
 */
export function mapUuidToRole(uuid: string): UserRole {
  const roleCode = roleUuidToCode[uuid as keyof typeof roleUuidToCode]

  switch (roleCode) {
    case "PROPIETARIO":
      return UserRole.propietario
    case "ADMIN":
      return UserRole.admin
    case "ALMACENISTA":
      return UserRole.almacenista
    case "CAJERO":
      return UserRole.cajero
    case "USER":
      return UserRole.user
    default:
      console.warn(`Unknown role UUID: ${uuid}, defaulting to USER`)
      return UserRole.user
  }
}

/**
 * Convert internal UserRole enum to UUID for API calls
 */
export function mapRoleToUuid(role: UserRole): string {
  const config = roleConfig[role]
  if (!config) {
    console.warn(`Unknown role: ${role}, defaulting to USER UUID`)
    return ROLES.USER
  }
  return config.uuid
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  return roleConfig[role]?.label || "Usuario"
}

/**
 * Get role badge color for Bootstrap classes
 */
export function getRoleBadgeColor(role: UserRole): string {
  return roleConfig[role]?.badgeColor || "secondary"
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  return roleConfig[role]?.description || "Rol de usuario básico"
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return [...(roleConfig[role]?.permissions ?? [])]
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

/**
 * Get roles that a user can manage
 */
export function getManageableRoles(role: UserRole): UserRole[] {
  return [...(roleConfig[role]?.canManage ?? [])]
}

/**
 * Check if current role can manage target role
 */
export function canManageRole(currentRole: UserRole, targetRole: UserRole): boolean {
  const manageableRoles = getManageableRoles(currentRole)
  return manageableRoles.includes(targetRole)
}

/**
 * Get all available roles sorted by priority (highest to lowest)
 */
export function getAllRolesSorted(): UserRole[] {
  return Object.keys(roleConfig)
    .map((role) => role as UserRole)
    .sort((a, b) => roleConfig[b].priority - roleConfig[a].priority)
}

/**
 * Get roles available for selection by current user
 */
export function getSelectableRoles(currentRole: UserRole): UserRole[] {
  const manageableRoles = getManageableRoles(currentRole)

  // If user can manage roles, they can also assign their own role (except for propietario creating another propietario)
  if (currentRole !== UserRole.propietario) {
    manageableRoles.push(currentRole)
  }

  return manageableRoles.sort((a, b) => roleConfig[b].priority - roleConfig[a].priority)
}

/**
 * Check if role is higher priority than another role
 */
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return roleConfig[role1].priority > roleConfig[role2].priority
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole) {
  return roleConfig[role]
}

/**
 * Validate if UUID is a valid role
 */
export function isValidRoleUuid(uuid: string): boolean {
  return uuid in roleUuidToCode
}

/**
 * Get all role UUIDs
 */
export function getAllRoleUuids(): string[] {
  return Object.values(ROLES)
}

/**
 * Get role statistics for display
 */
export function getRoleStats(users: Array<{ role: UserRole }>): Record<UserRole | "all", number> {
  const stats = {
    all: users.length,
    [UserRole.propietario]: 0,
    [UserRole.admin]: 0,
    [UserRole.almacenista]: 0,
    [UserRole.cajero]: 0,
    [UserRole.user]: 0,
  }

  users.forEach((user) => {
    if (user.role in stats) {
      stats[user.role]++
    }
  })

  return stats
}

// Export types for TypeScript
export type RoleCode = keyof typeof roleCodeToUuid
export type RoleUuid = (typeof ROLES)[keyof typeof ROLES]
export type RoleConfig = (typeof roleConfig)[UserRole]
