"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { formatDate } from "../lib/utils"
import type { User, Role } from "../types/User"
import { roles } from "../types/User"
import { fetchUsers } from "../services/user-service"

// Define role name type
export type RoleName = 'propietario' | 'administrador' | 'cajero'

// Create a map of role names to role objects
// const roleMap = new Map<RoleName, Role>(
//   roles.map(role => [role.name as RoleName, role])
// )


// Mock user data for demonstration
// const mockUsers = [
//   {
//     id: "1",
//     name: "Miguel Santana",
//     email: "miguel@example.com",
//     role: "propietario",
//     status: "Activo",
//     lastLogin: "2023-05-15T10:30:00Z",
//   },
//   {
//     id: "2",
//     name: "Ana Martínez",
//     email: "ana@example.com",
//     role: "administrador",
//     status: "Activo",
//     lastLogin: "2023-05-14T14:45:00Z",
//   },
//   {
//     id: "3",
//     name: "Carlos Rodríguez",
//     email: "carlos@example.com",
//     role: "cajero" as UserRole,
//     status: "Activo",
//     lastLogin: "2023-05-13T09:15:00Z",
//   },
//   {
//     id: "4",
//     name: "Laura Gómez",
//     email: "laura@example.com",
//     role: "administrador" as UserRole,
//     status: "Inactivo",
//     lastLogin: "2023-04-28T11:20:00Z",
//   },
// ]

// Define permission levels for each role
const rolePermissions: Record<string, {
  label: string;
  description: string;
  canManage: string[];
  badge: string;
  badgeClass: string;
}> = {
  propietario: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: ["administrador", "cajero", "propietario"],
    badge: "bg-danger",
    badgeClass: "bg-danger",
  },
  administrador: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: ["cajero"],
    badge: "bg-primary",
    badgeClass: "bg-primary",
  },
  cajero: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-secondary",
    badgeClass: "bg-secondary",
  },
}


export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string | "all">("all")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User>({
    id: "",
    fullname: "",
    email: "",
    role: roles.find(r => r.name === "cajero") || roles[0],
    password: "",
    enabled: true,
    createdAt: "",
  })

  const { user: currentAuthUser } = useAuth()


  useEffect(() => {
    
    const loadUsers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const users = await fetchUsers()
        setUsers(users)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error loading users")
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter users when search term or active tab changes
  useEffect(() => {
    let result = users

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role tab
    if (activeTab !== "all") {
      result = result.filter((user) => user.role.name === activeTab)
    }

    setFilteredUsers(result)
  }, [users, searchTerm, activeTab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentUser({ ...currentUser, [name]: value })
  }

  const handleAddUser = () => {
    setCurrentUser({
      id: "",
      fullname: "",
      email: "",
      role: roles.find(r => r.name === "cajero") || roles[0],
      password: "",
      enabled: true,
      createdAt: "",
    })
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser({
      id: user.id,
      fullname: user.fullname,
      email: user.email || "",
      role: user.role,
      password: "", // We don't show the password when editing
      enabled: user.enabled,
      createdAt: user.createdAt || "",
    })
    setShowModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting yourself
    if (currentAuthUser?.id === userId) {
      setError("No puedes eliminar tu propio usuario")
      return
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (currentUser.id) {
        // Update existing user
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? {
                  ...user,
                  fullname: currentUser.fullname,
                  email: currentUser.email,
                  role: currentUser.role,
                  enabled: currentUser.enabled,
                }
              : user,
          ),
        )
      } else {
        // Add new user
        const newUser = {
          id: `${Date.now()}`,
          fullname: currentUser.fullname,
          email: currentUser.email,
          role: currentUser.role,
          enabled: currentUser.enabled,
          createdAt: new Date().toISOString(),
          avatar: "",
        }
        setUsers([...users, newUser])
      }

      setShowModal(false)
      setIsLoading(false)
    }, 500)
  }

  // Count users by role
  const userCounts = {
    all: users.length,
    owner: users.filter((user) => user.role.name === "propietario").length,
    administrator: users.filter((user) => user.role.name === "administrador").length,
    cashier: users.filter((user) => user.role.name === "cajero").length,
  }

  // Check if current user can manage a specific role
  const canManageRole = (roleName: string): boolean => {
    if (!currentAuthUser) return false

    // Owner can manage all roles
    if (currentAuthUser.role.name === "propietario") return true

    // Administrator can only manage cashiers
    if (currentAuthUser.role.name === "administrador") return roleName === "cajero"

    // Cashiers can't manage any roles
    return false
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-semibold mb-1">Gestión de Usuarios</h2>
          <p className="text-secondary">
            Gestiona los usuarios del sistema y sus niveles de acceso. Cada rol tiene diferentes permisos y capacidades.
          </p>
        </div>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={handleAddUser}
          disabled={isLoading}
        >
          <i className="fas fa-plus"></i>
          <span>Añadir Usuario</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                Todos <span className="badge bg-secondary rounded-pill ms-1">{userCounts.all}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "propietario" ? "active" : ""}`}
                onClick={() => setActiveTab("propietario")}
              >
                Propietarios <span className="badge bg-danger rounded-pill ms-1">{userCounts.owner}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "administrador" ? "active" : ""}`}
                onClick={() => setActiveTab("administrador")}
              >
                Administradores <span className="badge bg-primary rounded-pill ms-1">{userCounts.administrator}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "cajero" ? "active" : ""}`}
                onClick={() => setActiveTab("cajero")}
              >
                Cajeros <span className="badge bg-secondary rounded-pill ms-1">{userCounts.cashier}</span>
              </button>
            </li>
          </ul>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Último Acceso</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-end">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-medium">{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${rolePermissions[user.role.name].badgeClass}`}>
                          {rolePermissions[user.role.name].label}
                        </span>
                      </td>
                      <td className="text-secondary">{formatDate(user.createdAt || "")}</td>
                      <td>
                        <span className={`badge ${user.enabled ? "bg-success" : "bg-danger"}`}>
                          {user.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="text-end">
                        {canManageRole(user.role.name) && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditUser(user)}
                              disabled={isLoading}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isLoading || currentAuthUser?.id === user.id}
                              title={
                                currentAuthUser?.id === user.id
                                  ? "No puedes eliminar tu propio usuario"
                                  : "Eliminar usuario"
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No hay usuarios en esta categoría
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h3 className="fs-5 fw-semibold mb-3">Roles y Permisos</h3>
      <div className="row">
        {Object.entries(rolePermissions).map(([role, info]) => (
          <div className="col-md-4 mb-3" key={role}>
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{info.label}</h5>
                <span className={`badge ${info.badge}`}>{role}</span>
              </div>
              <div className="card-body">
                <p className="card-text">{info.description}</p>
                <h6 className="mt-3 mb-2">Puede gestionar:</h6>
                <ul className="list-unstyled">
                  {info.canManage.length > 0 ? (
                    info.canManage.map((managedRole) => (
                      <li key={managedRole} className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {rolePermissions[managedRole as keyof typeof rolePermissions]?.label || managedRole}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">
                      <i className="fas fa-times-circle me-2"></i>
                      No puede gestionar usuarios
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{currentUser.id ? "Editar Usuario" : "Añadir Usuario"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                  disabled={isLoading}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={currentUser.fullname}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={currentUser.role.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      {/* Only show roles the current user can manage */}
                      {currentAuthUser?.role.name === "propietario" && <option value="propietario">Propietario</option>}
                      {(currentAuthUser?.role.name === "propietario" || currentAuthUser?.role.name === "administrador") && (
                        <option value="administrador">Administrador</option>
                      )}
                      <option value="cajero">Cajero</option>
                    </select>
                    <div className="form-text">
                      {rolePermissions[currentUser.role.name]?.description || "Selecciona un rol para ver su descripción"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      {currentUser.id ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={currentUser.password}
                      onChange={handleInputChange}
                      required={!currentUser.id}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={String(currentUser.enabled)}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {currentUser.id ? "Actualizando..." : "Creando..."}
                      </>
                    ) : currentUser.id ? (
                      "Actualizar"
                    ) : (
                      "Crear"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
