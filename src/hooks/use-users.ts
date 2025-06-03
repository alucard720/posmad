"use client"

import { useState, useEffect } from "react"
import { usersApi } from "../lib/mock-users-api"
import type { User, CreateUserRequest, UpdateUserRequest, UserRole } from "../types/users"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usersApi.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: CreateUserRequest) => {
    try {
      const newUser = await usersApi.createUser(userData)
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al crear usuario")
    }
  }

  const updateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      const updatedUser = await usersApi.updateUser(id, userData)
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))
      return updatedUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al actualizar usuario")
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await usersApi.deleteUser(id)
      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al eliminar usuario")
    }
  }

  const toggleUserStatus = async (id: string) => {
    try {
      const updatedUser = await usersApi.toggleUserStatus(id)
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))
      return updatedUser
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al cambiar estado")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getUsersByRole = (role: UserRole) => {
    return users.filter((user) => user.role === role)
  }

  const getUserCounts = () => {
    return {
      total: users.length,
      propietarios: getUsersByRole("propietario").length,
      administradores: getUsersByRole("admin").length,
      cajeros: getUsersByRole("cajero").length,
      almacenistas: getUsersByRole("almacenista").length,
      usuarios: getUsersByRole("user").length,
    }
  }

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refetch: fetchUsers,
    getUsersByRole,
    getUserCounts,
  }
}
