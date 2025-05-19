"use client"

import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
// Demo user roles
const USER_ROLES = [
  { role: "administrator", label: "Administrador", color: "primary" },
  { role: "owner", label: "Propietario", color: "danger" },
  { role: "cashier", label: "Cajero", color: "success" },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const navigate = useNavigate()

  // Auto-login as administrator in development mode
  useEffect(() => {
    const autoLogin = async () => {
      if (process.env.NODE_ENV === "development") {
        await handleDirectLogin("administrator")
      }
    }

    autoLogin()
  }, [])

  const handleDirectLogin = async (role: string) => {
    setSelectedRole(role)
    setIsLoading(true)

    try {
      // Set auth cookies
      document.cookie = "auth-token=authenticated; path=/; max-age=86400"
      document.cookie = `user-role=${role}; path=/; max-age=86400`

      // Create mock user
      const mockUser = {
        id: `demo-${Date.now()}`,
        name: role === "administrator" ? "Admin User" : role === "owner" ? "Owner User" : "Cashier User",
        email: `${role}@example.com`,
        role: role,
        status: "Activo",
        lastLogin: new Date().toISOString(),
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/")
      }, 500)
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fs-2 fw-bold">Acceso Directo</h2>
            <p className="text-secondary">Selecciona un rol para acceder al sistema</p>
          </div>

          <div className="d-flex flex-column gap-3 mb-3">
            {USER_ROLES.map((userRole) => (
              <button
                key={userRole.role}
                className={`btn btn-${userRole.color} py-3 position-relative`}
                onClick={() => handleDirectLogin(userRole.role)}
                disabled={isLoading}
              >
                {isLoading && selectedRole === userRole.role ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Accediendo...
                  </>
                ) : (
                  <>
                    <i
                      className={`fas fa-user-${userRole.role === "administrator" ? "shield" : userRole.role === "owner" ? "tie" : "tag"} me-2`}
                    ></i>
                    Entrar como {userRole.label}
                  </>
                )}
                {isLoading && selectedRole === userRole.role && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="alert alert-info mt-4">
            <i className="fas fa-info-circle me-2"></i>
            Este es un modo de demostración. Se creará una sesión temporal con el rol seleccionado.
          </div>
        </div>
      </div>
    </div>
  )
}
