import axios from "axios"
import type { User } from "../types/User"

// // Define user types
// export type User = {
//   id: string
//   email: string
//   fullname: string
//   password: string // Note: In a real app, passwords should never be stored in plain text
//   role: string
//   enabled: boolean
//   createdAt: string
//   updatedAt: string
//   token?: string
// }

// MockAPI URL - replace with your actual MockAPI endpoint
const API_URL = "http://localhost:8184/v1/auth/profile"

// Get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get(API_URL)

    return response.data || []
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


