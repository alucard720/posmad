import axios from 'axios';
import { handleError } from "../lib/handleError";
import type { User } from "../types/User";
import { ROLES } from "../types/roles";
// Define types for authentication


// API URL with fallback for preview environment
const api = "http://localhost:8184"

/**
 * Authenticate a user with email and password
 */


const axiosInstance = axios.create({
    baseURL: api,
    withCredentials: true,
    headers:{Authorization: `Bearer ${localStorage.getItem("token")}`},
});


export const registerAPI = async(fullname: string, email: string,  role: string, enable:string)=>{
    try {
        const response = await axios.post( api + "/v1/auth/sign-up", {
            fullname,
            email,
            role,
            enable
            
        });
       
        const datawithToken = {
            token: `fake-jwt-token-${Date.now()}`,
            userName: response.data.userName,
            email: response.data.email,
            
        };

        console.log("datawithToken:", datawithToken);

        await axiosInstance.post(api + "tokens",datawithToken);
        return datawithToken;   
       

    }catch (error) {
        handleError(error);
        throw error;
    }

}

export const loginAPI = async(email: string, password: string)=>{
     try {
    const loginResponse = await axios.post(
      api + "/v1/auth/sign-in",
      { email, password }
    );

    const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.accessToken || loginResponse.data?.Token;
    if(!accessToken){
        throw new Error("No access token received from server");
    }
    
    const profileResponse = await axios.get(api + "/v1/auth/profile",{
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    });
    
    const profileData = profileResponse.data?.data;
    if(!profileData){
        throw new Error("No profile data received from server");
    }
    
    const user: User = {
        id: profileData.id,
        fullname: profileData.fullname,
        email: profileData.email,
        password: "",
        role: profileData.role,
        enabled: profileData.enabled,
        createdAt: profileData.createdAt,
    }
    
    const validateRoles = Object.values(ROLES);
    if(!validateRoles.includes(profileData.role)){
        console.error(`Invalid role: ${profileData.role}`);
        throw new Error("Invalid role");
    }
    
   localStorage.setItem("token", accessToken);
   localStorage.setItem("user", JSON.stringify(user));
   axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
   
   return{
    accessToken,
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    enabled: user.enabled,
    createdAt: user.createdAt,
   }
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const refreshTokenAPI = async()=>{
    try {
       const response = await axiosInstance.post<{ accessToken: string }>(api + "v1/auth/refresh-token");
       return response.data.accessToken; 
        
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    try {
        const loginResponse = await axios.post(`${api}/v1/auth/sign-in`, { email, password });
        const accessToken = loginResponse.data?.data?.accessToken || loginResponse.data?.accessToken || loginResponse.data?.token;
    
        if (!accessToken) {
          throw new Error("No access token received from server");
        }
    
        const profileResponse = await axios.get(`${api}/v1/auth/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
    
        const profileData = profileResponse.data?.data;
    
        if (!profileData) {
          throw new Error("No profile data received");
        }
    
        const user: User = {
          id: profileData.id,
          email: profileData.email,
          fullname: profileData.fullname,
          role: profileData.role,
          enabled: profileData.enabled,
          createdAt: profileData.createdAt,
          password: "",
        };
    
        return user;
      } catch (error) {
        console.error("Error authenticating user:", error);
        handleError(error);
        return null;
      }
}




axiosInstance.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(error. response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const newAccesstoken = await refreshTokenAPI();                
                originalRequest.headers["Authorization"] = `Bearer ${newAccesstoken}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }
    }
        return Promise.reject(error);
    }
);



export default axiosInstance;