import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { type User, type UserRole } from "../types/User"
import { loginAPI } from "../services/auth-service"
import axios from "axios";



type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: UserRole | null
  loginUser: (email: string, password: string) => void
  //register: (name: string, email: string, password: string, role: UserRole, status: string) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsLoading(true);
  }, []);

  // const login = async (email: string, password: string): Promise<boolean> => {
  //   try {
  //     setIsLoading(true)

  //     const apiUser = await authenticateUser(email, password)

  //     if (apiUser) {
  //       // Map API user to our User type
  //       const loggedInUser: User = {
  //         id: apiUser.id,
  //         fullname: apiUser.fullname,
  //         email: apiUser.email,
  //         role: apiUser.role,
  //         enabled: apiUser.enabled,
  //         createdAt: apiUser.createdAt,
  //       }

  //       // Store user in localStorage
  //       localStorage.setItem("user", JSON.stringify(loggedInUser))

  //       // Store role in cookie for middleware
  //       document.cookie = `user-role=${loggedInUser.role}; path=/; max-age=86400`

  //       setUser(loggedInUser)
  //       return true
  //     }

  //     return false
  //   } catch (error) {
  //     console.error("Login failed:", error)
  //     return false
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const register = async (
  //   fullname: string,
  //   email: string,
  //   password: string,
  //   role: UserRole,
  //   enabled: boolean,
  // ): Promise<boolean> => {
  //   try {
  //     setIsLoading(true)

  //     const newUser: Omit<User, "id"> = {
  //       id:"",
  //       fullname,
  //       email,
  //       password,
  //       role,
  //       enabled,
  //     }

  //     const createdUser = await createUser(newUser)
  //     return !!createdUser
  //   } catch (error) {
  //     console.error("Registration failed:", error)
  //     return false
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }


  const loginUser = async (email: string, password: string) => {
   
    try {
      const token = await loginAPI(email, password);
      if (token) {
        localStorage.setItem("token", token);
        const userObj: User = {        
          id: token.id, // Replace with actual user ID from API response
          fullname: token.User_fullname,  // Replace with actual user name from API response
          email: email,
          password: "",
          role: token.role,          
          enabled: true,    // Replace with actual role from API response
          createdAt:""
        };

        localStorage.setItem("user", JSON.stringify(userObj));       
        setUser(userObj);
        // toast.success("Login Exitoso")
        navigate("/dashboard");
      }
    } catch (e) {
      console.error('Login error:', e);
      
    }
  };

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
        loginUser,
        logout,
        hasPermission,
      }}
    >
      {isLoading ? children : null}
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

