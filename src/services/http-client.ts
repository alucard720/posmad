import { getAuthToken } from "./user-service"

// HTTP client with interceptors for authentication
export async function httpClient(url: string, options: RequestInit = {}): Promise<Response> {
  // Get the token
  const token = getAuthToken()

  // Add authorization header if token exists
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    "Content-Type": "application/json",
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401) {
    // Clear tokens
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userId")

    // Redirect to login page
    window.location.href = "/login"

    throw new Error("Session expired. Please log in again.")
  }

  return response
}

// GET request
export async function get<T>(url: string): Promise<T> {
  const response = await httpClient(url)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}

// POST request
export async function post<T>(url: string, data: string): Promise<T> {
  const response = await httpClient(url, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}

// PUT request
export async function put<T>(url: string, data: string): Promise<T> {
  const response = await httpClient(url, {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}

// DELETE request
export async function del<T>(url: string): Promise<T> {
  const response = await httpClient(url, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}
