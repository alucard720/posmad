import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "../types/User"
import { loginAPI } from "../services/auth-service"
import axios from "axios";
import { createUser } from "../services/user-service"
import { ROLES } from "../types/roles" 


type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: typeof ROLES[keyof typeof ROLES] | null
  token: string | null
  setToken: (token: string | null) => void
  loginUser: (email: string, password: string) => void
  register: (name: string, email: string, password: string, role: string, enabled: boolean ) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: string | string[]) => boolean
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
      const parserUser = JSON.parse(user);
      // console.log("AuthProvider: parserUser", {
      //   email: parserUser.email,
      //   fullname: parserUser.fullname,
      //   role: parserUser.role,
        
      // });     
      setUser(parserUser);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);


  const register = async (
    fullname: string,
    email: string,
    password: string,
    role: string,
    enabled: boolean,
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      const newUser: Omit<User, "id"> = {
        fullname,
        email,
        password,
        role,
        enabled,
        createdAt: new Date().toISOString(),
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



// Login function
const loginUser = async (email: string, password: string) => {
   
  try {
    setIsLoading(false);
    // console.log("loginUser: email", { email } );
    const token = await loginAPI(email, password);
    // console.log("loginUser : token data",{
    //   email: token.email,
    //   fullname: token.fullname,
    //   role: token.role,      
    // })    
    if (token) {
      localStorage.setItem("token", token.accessToken);        
      const userObj: User = {        
        id: token.id, 
        fullname: token.fullname, 
        email: token.email,
        password: "",
        role: token.role as typeof ROLES[keyof typeof ROLES],          
        enabled: true,    
        createdAt:""
      };      
      localStorage.setItem("user", JSON.stringify(userObj));       
      setUser(userObj);      
      setToken(token.accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.accessToken}`; 
      // console.log("loginUser: axios.defaults.headers.common", axios.defaults.headers.common);
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
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    navigate("/")
  }

  // Helper function to check if user has required role(s)
  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false
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
        userRole: user?.role as typeof ROLES[keyof typeof ROLES] | null,
        loginUser,
        logout,
        register,
        hasPermission,
        token,
        setToken
      }}
    >
      {isLoading ? null : children}
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