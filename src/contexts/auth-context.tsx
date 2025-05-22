import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "../types/User"
import { loginAPI } from "../services/auth-service"
import axios from "axios";
import { createUser } from "../services/user-service"
import { ROLES } from "../types/roles"



interface JwtPayload {
    user: {
        id: string;
        role: string;
    };
    iat: number;
    exp: number;
}

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
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsLoading(true);
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
    const token = await loginAPI(email, password);
    if (token) {
      localStorage.setItem("token", token.accessToken);        
      const userObj: User = {        
        id: token.id, 
        fullname: token.fullname, 
        email: email,
        password: password,
        role: token.role as typeof ROLES[keyof typeof ROLES],          
        enabled: true,    
        createdAt:""
      };      
      localStorage.setItem("user", JSON.stringify(userObj));       
      setUser(userObj);      
      setToken(token.accessToken);     
      navigate("/dashboard");
    }
  } catch (e) {
    console.error('Login error:', e);
    
  }


};



  // const loginUser = async (email: string, password: string) => {
   
  //   try {
  //     const token = await loginAPI(email, password);
  //     if (token) {
  //       localStorage.setItem("token", token.accessToken);
  //       const userObj: User = {        
  //         id: token.id, // Replace with actual user ID from API response
  //         fullname: token.fullname,  // Replace with actual user name from API response
  //         email: email,
  //         password: "",
  //         role: token.role as typeof ROLES[keyof typeof ROLES],          
  //         enabled: true,    // Replace with actual role from API response
  //         createdAt:""
  //       };
  //       console.log(token.role)
  //       localStorage.setItem("user", JSON.stringify(userObj));       
  //       setUser(userObj);
  //       setToken(token.accessToken);


        
  //       navigate("/dashboard");
  //     }
  //   } catch (e) {
  //     console.error('Login error:', e);
      
  //   }
  // };

  const logout = () => {
    localStorage.removeItem("user")
    document.cookie = "auth-token=; path=/; max-age=0"
    document.cookie = "user-role=; path=/; max-age=0"
    setUser(null)
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