import type { User, CreateUserRequest, UpdateUserRequest } from "../types/users"
import { ROLES } from "../types/users"

// Mock user data with UUID roles
const mockUsers: User[] = [
  {
    id: "1",
    name: "POS Default SuperAdmin User",
    email: "admin@madtech.com.do",
    role: "admin",
    roleId: ROLES.ADMIN,
    status: "active",
    createdAt: new Date("2023-05-23T14:36:00Z"),
    updatedAt: new Date("2023-05-23T14:36:00Z"),
    permissions: ["*"],
  },
  {
    id: "2",
    name: "miguel.santana",
    email: "miguel.santana@madtech.com.do",
    role: "admin",
    roleId: ROLES.ADMIN,
    status: "active",
    createdAt: new Date("2023-05-24T12:04:00Z"),
    updatedAt: new Date("2023-05-24T12:04:00Z"),
    permissions: ["*"],
  },
  {
    id: "3",
    name: "Propietario Demo",
    email: "propietario@madtech.com.do",
    role: "propietario",
    roleId: ROLES.PROPIETARIO,
    status: "active",
    createdAt: new Date("2023-05-23T14:36:00Z"),
    updatedAt: new Date("2023-05-23T14:36:00Z"),
    permissions: [
      "users.create.cajero",
      "users.create.almacenista",
      "users.read",
      "users.update.cajero",
      "users.update.almacenista",
      "users.delete.cajero",
      "users.delete.almacenista",
      "products.*",
      "sales.*",
      "analytics.read",
      "sales_history.read",
      "reports.read",
      "settings.update",
      "inventory.*",
    ],
  },
  {
    id: "4",
    name: "Cajero Demo",
    email: "cajero@madtech.com.do",
    role: "cajero",
    roleId: ROLES.CAJERO,
    status: "active",
    createdAt: new Date("2023-05-23T14:36:00Z"),
    updatedAt: new Date("2023-05-23T14:36:00Z"),
    permissions: ["sales.create", "sales.read", "products.read", "customers.*"],
  },
  {
    id: "5",
    name: "Almacenista Demo",
    email: "almacenista@madtech.com.do",
    role: "almacenista",
    roleId: ROLES.ALMACENISTA,
    status: "active",
    createdAt: new Date("2023-05-25T10:15:00Z"),
    updatedAt: new Date("2023-05-25T10:15:00Z"),
    permissions: ["products.*", "inventory.*", "stock.*", "suppliers.*", "reports.inventory"],
  },
  {
    id: "6",
    name: "Usuario Demo",
    email: "user@madtech.com.do",
    role: "user",
    roleId: ROLES.USER,
    status: "active",
    createdAt: new Date("2023-05-26T08:30:00Z"),
    updatedAt: new Date("2023-05-26T08:30:00Z"),
    permissions: ["products.read", "customers.read"],
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const usersApi = {
  // Get all users
  async getUsers(): Promise<User[]> {
    await delay(500)
    return [...mockUsers]
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    await delay(300)
    return mockUsers.find((user) => user.id === id) || null
  },

  // Create new user
  async createUser(data: CreateUserRequest): Promise<User> {
    await delay(800)

    // Check if email already exists
    if (mockUsers.some((user) => user.email === data.email)) {
      throw new Error("El email ya está en uso")
    }

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      roleId: data.roleId,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [],
    }

    mockUsers.push(newUser)
    return newUser
  },

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    await delay(600)

    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado")
    }

    // Check email uniqueness if email is being updated
    if (data.email && mockUsers.some((user) => user.email === data.email && user.id !== id)) {
      throw new Error("El email ya está en uso")
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date(),
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await delay(400)

    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado")
    }

    // Prevent deleting the last admin
    const user = mockUsers[userIndex]
    if (user.role === "admin") {
      const adminCount = mockUsers.filter((u) => u.role === "admin").length
      if (adminCount <= 1) {
        throw new Error("No se puede eliminar el último administrador")
      }
    }

    mockUsers.splice(userIndex, 1)
  },

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    await delay(300)

    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado")
    }

    const user = mockUsers[userIndex]
    user.status = user.status === "active" ? "inactive" : "active"
    user.updatedAt = new Date()

    return user
  },
}
