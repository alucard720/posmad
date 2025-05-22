"use client"

import { useAuth } from "../contexts/auth-context"
import { useState } from "react"
import { ROLES } from "../types/roles"

type HeaderProps = {
  title: string
}
const roleDisplayNames = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.USER]: "Propietario",
  [ROLES.PROP]: "Usuario",
  [ROLES.CAJERO]: "Cajero",
  [ROLES.SUPER]: "Superuser",
}

const roleBadgeClasses = {
  [ROLES.ADMIN]: "bg-danger",
  [ROLES.PROP]: "bg-primary",
  [ROLES.USER]: "bg-secondary",
  [ROLES.CAJERO]: "bg-primary",
  [ROLES.SUPER]: "bg-primary",
}


export function Header({ title }: HeaderProps) {
  const { logout, user } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  // Generate initials from user name
  const getInitials = (fullname: string | undefined) => {
    if (!fullname) return "??"
    console.log(fullname)
    return fullname
      
  }
<<<<<<< HEAD
  const displayRole = user?.role && Object.values(ROLES).includes(user.role)
  ? roleDisplayNames[user.role]
  : "Administrador";

const badgeClass = user?.role && Object.values(ROLES).includes(user.role)
  ? roleBadgeClasses[user.role]
  : "bg-secondary";

if (user?.role && !Object.values(ROLES).includes(user.role)) {
  console.warn(`Header: Invalid user role detected: ${user.role}`);
}

console.log("Header: Rendering user data", {
  email: user?.email,
  fullname: user?.fullname,
  role: user?.role,
  displayRole,
});



=======
  const displayRole = user?.role && Object.values(ROLES).includes(user.role) ? roleDisplayNames[user.role] : "Administrador"
  const displayRoleBadgeClass = user?.role && Object.values(ROLES).includes(user.role) ? roleBadgeClasses[user.role] : "bg-secondary"
  if(user?.role && Object.values(ROLES).includes(user.role)){
    console.warn(`Invalid role: ${user.role}`)
  }
  
>>>>>>> 1f0384bf30343902128227d045e386c7b1550f34
  return (
    <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      <h1 className="fs-4 fw-bold text-dark mb-0">{title}</h1>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-decoration-none text-secondary">
          <span className="small">Ayuda</span>
        </button>
        <div className="dropdown">
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">{getInitials(user?.fullname)}</div>
            <div className="small">
              <div className="fw-medium">{user?.fullname}</div>
              <div className="text-secondary small">
                {user?.email}
                {user && user.role && (
<<<<<<< HEAD
                  <span
                    className={`badge ms-1 ${badgeClass}`}>
                    {displayRole}
                  </span>
=======
                  <span className={`badge ms-1 ${displayRoleBadgeClass}`}>{displayRole}</span>

>>>>>>> 1f0384bf30343902128227d045e386c7b1550f34
                )}
              </div>
            </div>
            <i className="fas fa-chevron-down text-secondary small"></i>
          </div>

          <div className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}>
            <button className="dropdown-item d-flex align-items-center" onClick={logout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
