import { UserRole, type Permissions } from "../types/User";

export const rolePermissions: Record<UserRole, Permissions> = {
  [UserRole.propietario]: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: [UserRole.cajero, UserRole.propietario],
    badge: "bg-red-600",
  },
  [UserRole.administrador]: {
    label: "Administrador",
    description: "Acceso a funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: [UserRole.administrador, UserRole.cajero, UserRole.propietario],
    badge: "bg-blue-600",
  },
  [UserRole.cajero]: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-gray-500",
  },
};
