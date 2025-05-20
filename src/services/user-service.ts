import type { UserRole } from "../types/User"

// Define user types
export type User = {
  id: string
  email: string
  fullname: string
  password: string // Note: In a real app, passwords should never be stored in plain text
  role: UserRole
  enabled: boolean
  createdAt: string
  token?: string
}

// MockAPI URL - replace with your actual MockAPI endpoint
const MOCKAPI_URL = "http://localhost:8184/v1/auth/sign-in"

// Get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(MOCKAPI_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const response = await fetch(MOCKAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Update an existing user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${MOCKAPI_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }
}

// Authenticate a user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // In a real app, you would use a dedicated authentication endpoint
    // For MockAPI, we'll fetch all users and find the matching one
    const users = await fetchUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Update last login time
      // const now = new Date().toISOString()
      // await updateUser(user.id, { lastLogin: now })
      return user
    }

    return null
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
