"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/auth-context"
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/user-service"
import type { User } from "../types/User"

interface UserManagementProps {
  compact?: boolean
}

export function UserManagement({ compact = false }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{
    id?: string
    name: string
    email: string
    role: string
    password: string
    enabled: boolean
  }>({
    name: "",
    email: "",
    role: "cashier",
    password: "",
    enabled: true,
  })

  const { register } = useAuth()

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const data = await fetchUsers()
        setUsers(data)
        setError(null)
      } catch (err) {
        setError("Error al cargar usuarios. Por favor, intenta de nuevo.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // For compact mode, limit to 5 users
  const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentUser({ ...currentUser, [name]: value })
  }

  const handleAddUser = () => {
    setCurrentUser({
      name: "",
      email: "",
      role: "cashier",
      password: "",
      enabled: true,
    })
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser({
      id: user.id,
      name: user.fullname,
      email: user.email,
      role: user.role,
      password: "", // We don't show the password when editing
      enabled: user.enabled,
    })
    setShowModal(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const success = await deleteUser(userId)
        if (success) {
          setUsers(users.filter((user) => user.id !== userId))
        } else {
          alert("Error al eliminar el usuario")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error al eliminar el usuario")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentUser.id) {
        // Update existing user
        const updatedUser = await updateUser(currentUser.id, {
          fullname: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          enabled: true,
          ...(currentUser.password ? { password: currentUser.password } : {}),
        })

        if (updatedUser) {
          setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)))
        } else {
          throw new Error("Failed to update user")
        }
      } else {
        // Add new user
        const newUser = await createUser({
          fullname: currentUser.name,
          email: currentUser.email,
          password: currentUser.password,
          role: currentUser.role,
          enabled: true,
          createdAt: new Date().toISOString(),
        })

        if (newUser) {
          setUsers([...users, newUser])
          // Also register in auth context
          await register(
            currentUser.name,
            currentUser.email,
            currentUser.password,
            currentUser.role,
            currentUser.enabled,
          )
        } else {
          throw new Error("Failed to create user")
        }
      }

      setShowModal(false)
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Error al guardar el usuario")
    }
  }

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div>
      {!compact && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 fw-semibold">Gestión de Usuarios</h2>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleAddUser}>
            <i className="fas fa-plus"></i>
            <span>Añadir Usuario</span>
          </button>
        </div>
      )}

      {!compact && (
        <div className="mb-4 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={compact ? "" : "card shadow-sm"}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                {!compact && <th scope="col">Último Acceso</th>}
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-medium">{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === "administrator" ? "bg-primary" : "bg-secondary"}`}>
                        {user.role === "administrator" ? "Administrador" : "Cajero"}
                      </span>
                    </td>
                    {!compact && <td className="text-secondary">{user.createdAt || "-"}</td>}
                    <td>
                      <span className={`badge ${user.enabled ? "bg-success" : "bg-danger"}`}>
                        {user.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(user)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={compact ? 5 : 6} className="text-center py-4">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {compact && filteredUsers.length > 5 && (
          <div className="p-3 text-center border-top">
            <Link to="/usuarios" className="btn btn-sm btn-outline-primary">
              Ver todos los usuarios <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        )}

        {compact && (
          <div className="p-3 text-end border-top">
            <button className="btn btn-success btn-sm" onClick={handleAddUser}>
              <i className="fas fa-plus me-1"></i> Añadir Usuario
            </button>
          </div>
        )}
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
                      value={currentUser.name}
                      onChange={handleInputChange}
                      required
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
                      value={currentUser.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="cashier">Cajero</option>
                      <option value="administrator">Administrador</option>
                    </select>
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
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="enabled"
                      name="enabled"
                      value={currentUser.enabled ? "true" : "false"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {currentUser.id ? "Actualizar" : "Crear"}
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
