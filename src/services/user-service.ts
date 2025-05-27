// import axiosInstance from "./auth-service"
import axios from "axios"
import type { User,  } from "../types/User"
import { ROLES } from "../types/roles"
import axiosInstance from "./auth-service"

const roleMapping: Record<string, string> = {
  "ADMIN": ROLES.ADMIN,
  "CAJERO": ROLES.CAJERO,
  "USUARIO": ROLES.USER,
  "PROPIETARIO": ROLES.PROPIETARIO,
  "ALMACENISTA": ROLES.ALMACENISTA
}

// API URL - actual API endpoint
const api = "http://localhost:8184"


const checkToken = ()=>{
  const token = localStorage.getItem("token")
  if(!token){
    throw new Error("No token found, cannot fetch users")
  }
  console.log("checkToken: Token found", token)
  return token
}
// Get all users
export async function fetchUsers(): Promise<User[]> {
  const accessToken = checkToken()

  try {
    console.log("fetchUsers: Sending GET request to", api)
    const response = await axios.get(`${api}/v1/users`,{
      headers:{
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log("fetchUsers: Response from", api, response.data)

    const users = response.data?.data?.records || []


    if(!Array.isArray(users)){
      console.error("fetchUsers: Invalid response format. Expected array, got:", users)     
    }

    const mappedUsers = users.map((user: User) => ({
      ...user,
      role: user.role ? roleMapping[user.role.toUpperCase()] : ""
    }))
    console.log("fetchUsers: Mapped users", mappedUsers)
    return mappedUsers; 


  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}


// export async function fetchUsers(): Promise<User[]> {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("fetchUsers: No token found, cannot fetch users");
//     throw new Error("No autorizado: por favor inicia sesión");
//   }

//   try {
//     console.log("fetchUsers: Sending /v1/users request with token");
//     const response = await axiosInstance.get(`${API_URL}/v1/users`);
//     console.log("fetchUsers: Response", response.data);

//     const users = response.data?.data?.records || [];

//     if (!Array.isArray(users)) {
//       throw new Error("Formato de respuesta inválido: se esperaba un arreglo de usuarios");
//     }

//     const mappedUsers: User[] = users.map((user: any) => ({
//       id: user.id,
//       email: user.email,
//       fullname: user.fullname,
//       role: roleMapping[user.role?.toUpperCase()] || user.role,
//       enabled: user.enabled,
//       createdAt: user.createdAt,
//       password: "",
//     }));

//     console.log("fetchUsers: Mapped users", mappedUsers);
//     return mappedUsers;
//   } catch (error: any) {
//     console.error("fetchUsers: Error fetching users", {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//     });
//     if (error.response?.status === 401) {
//       throw new Error("No autorizado: por favor inicia sesión nuevamente");
//     }
//     if (error.response?.status === 403) {
//       throw new Error("Acceso denegado: se requiere rol de administrador");
//     }
//     throw new Error(error.message || "Error al obtener usuarios");
//   }
// }
// Get user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await axiosInstance.get(`${api}/v1/users/${id}`)

    return response.data?.data?.records || null
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const response = await axiosInstance.post(`${api}/v1/users`, user)

    return response.data?.data?.records || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Update an existing user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await axiosInstance.put(`${api}/v1/users/${id}`, updates)

    return response.data?.data?.records || null

  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const response = await axiosInstance.delete(`${api}/v1/users/${id}`)

    return response.data?.data?.records || false
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return false
  }
}

// Authenticate a user
// export async function authenticateUser(email: string, fullname: string): Promise<{user: User, token: string} | null> {
//  try {
//   const loginResponse = await axios.post(`${API_URL}/v1/auth/sign-in`, {email, fullname});
//   const token = loginResponse.data?.data?.accessToken || loginResponse.data?.token;

//   if (!token) {
//     throw new Error("No access token received from server");
//   }
//    const profileData = await axios.get(`${API_URL}/v1/auth/profile`,{
//     headers:{
//       Authorization: `Bearer ${token}`
//     }
//    });

//    if(!profileData){
//     throw new Error("No profile data received from server");
//    }

//    const user: User = {
//     id: profileData.data.id,
//     fullname: profileData.data.fullname,
//     email: profileData.data.email,
//     password: "",
//     role: profileData.data.role,
//     enabled: profileData.data.enabled,
//     createdAt: profileData.data.createdAt,
    
//    }

//    //valida los roles
//    const validRoles = Object.values(ROLES);
//    if(!validRoles.includes(user.role)){
//     console.error(`Invalid role: ${user.role}`);
//     throw new Error("Invalid role");
//    }

//    return {user, token};
//  } catch (error) {
//     console.error("Error authenticating user:", error);
//     return null;
  
//  }
// }


