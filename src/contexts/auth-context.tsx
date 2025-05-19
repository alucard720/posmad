import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { authenticateUser, createUser, type User, type UserRole} from "../services/user-service"

// Update the UserRole type to include "owner"



  

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: UserRole | null
  login: (email: string, password: string) => Promise<boolean>
  register: (fullname: string, email: string, password: string, role: UserRole, enabled: boolean) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // If no user in localStorage but auth-token cookie exists, create a default user
          const authToken = document.cookie.includes("auth-token=authenticated")
          const roleMatch = document.cookie.match(/user-role=([^;]+)/)
          const role = roleMatch ? (roleMatch[1] as UserRole) : "cajero"

          if (authToken) {
            const defaultUser: User = {
              id: `default-${Date.now()}`,
              fullname: role === "administrador" ? "Admin User" : role === "propietario" ? "Owner User" : "Cashier User",
              email: `${role}@example.com`,
              role: role,
              enabled: true,
             
            }

            setUser(defaultUser)
            localStorage.setItem("user", JSON.stringify(defaultUser))
          }
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      const apiUser = await authenticateUser(email, password)

      if (apiUser) {
        // Map API user to our User type with all properties
        const loggedInUser: User = {
          id: apiUser.id,
          fullname: apiUser.fullname,
          email: apiUser.email,
          role: apiUser.role,
          enabled: apiUser.enabled,
         
        }

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(loggedInUser))

        // Store role in cookie for middleware
        document.cookie = `user-role=${loggedInUser.role}; path=/; max-age=86400`

        setUser(loggedInUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    fullname: string,
    email: string,
    password: string,
    role: UserRole,
    enabled: boolean,
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      const newUser: User = {
        id: `default-${Date.now()}`,
        fullname,
        email,
        password,
        role,
        enabled,
        
      }

      const createdUser = await createUser(newUser)
      return !!createdUser
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    document.cookie = "auth-token=; path=/; max-age=0"
    document.cookie = "user-role=; path=/; max-age=0"
    setUser(null)
    navigate("/login")
  }

  // Helper function to check if user has required role(s)
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }

    return user.role === requiredRole
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        login,
        register,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { UserRole }
