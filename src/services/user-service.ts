import axios from "axios"
import type { Role } from "../types/User"

// Define user types
export type User = {
  id: string
  email: string
  fullname: string
  password: string // Note: In a real app, passwords should never be stored in plain text
  role: Role
  enabled: boolean
  createdAt: string
  updatedAt: string
  token?: string
}

// MockAPI URL - replace with your actual MockAPI endpoint
const API_URL = "http://localhost:8184/v1/users"

// Get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get(API_URL)

    return response.data?.data?.records || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await axios.get(`${API_URL}/${id}`)

    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const response = await axios.post(API_URL, user)

    return response.data?.data?.records || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Update an existing user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates)

    return response.data?.data?.records || null

  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)

    return response.data?.data?.records || false
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }
}

// Authenticate a user
export async function authenticateUser(email: string, password: string): Promise<{user: User, token: string} | null> {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password })

    const {user, token} = response.data?.data?.records || null

    return {user, token}
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Fallback mock users
// function getMockUsers(): User[] {
//   return [
//     {
//       id: "1",
//       email: "owner@example.com",
//       fullname: "Owner User",
//       password: "password123",
//       role: "propietario",
//       enabled: true,
//       createdAt: "2023-05-15 10:30",
//     },
//     {
//       id: "2",
//       email: "admin@example.com",
//       fullname: "Admin User",
//       password: "password123",
//       role: "administrator",
//       enabled: true,
//       createdAt: "2023-05-14 09:15",
//     },
//     {
//       id: "3",
//       email: "cashier@example.com",
//       fullname: "Cashier User",
//       password: "password123",
//       role: "cashier",
//       enabled: true,
//       createdAt: "2023-05-13 14:20",
//     },
//   ]
// }
