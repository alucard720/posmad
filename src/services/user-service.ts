export type UserRole = 'cajero' | 'administrador' | 'propietario';

export const userRoles = {
  cajero: "cajero",
  administrador: "administrador",
  propietario: "propietario"
} as const;

export type User = {
    id: string
    fullname: string
    email: string
    role: UserRole
    enabled: boolean
    password?: string
    lastLogin?: string
    avatar?: string
  }

const baseUrl = "http://localhost:8104/v1/auth/profile"

//recoje todos los usuarios
export async function fetchUsers(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!response) {
      throw new Error("Network response was not ok")
    }
    const data = response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

//usuario por id
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${baseUrl}/${id}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

//crear usuario
export async function createUser(user: User): Promise<User | null> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

//actualizar usuario
export async function updateUser(id: string, user: User): Promise<User | null> {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

//eliminar usuario
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

//authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

//logout user
export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/logout`, {
      method: "POST",
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return true
  } catch (error) {
    console.error("Error logging out user:", error)
    return false
  }
}