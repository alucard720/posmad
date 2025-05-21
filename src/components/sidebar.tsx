import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { ROLE_PERMISSIONS } from "../types/User"

// Define menu items with role-based access
const menuItems = [
  {
    href: "/",
    icon: "fa-check-circle",
    label: "Vender",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
    highlight: true,
  },
  {
    href: "/demo",
    icon: "fa-shopping-cart",
    label: "Demo Pagos",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
  },
  // {
  //   href: "/pedidos",
  //   icon: "fa-shopping-cart",
  //   label: "Pedidos",
  //   roles: [userRoles.administrador, userRoles.cajero, userRoles.propietario],
  // },
  {
    href: "/productos",
    icon: "fa-th",
    label: "Productos",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
  },
  {
    href: "/catalogo",
    icon: "fa-list",
    label: "Catálogo",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
  },
  {
    href: "/clientes",
    icon: "fa-users",
    label: "Clientes",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
  },
  {
    href: "/transacciones",
    icon: "fa-exchange-alt",
    label: "Transacciones",
    roles: [ROLE_PERMISSIONS.administrador, ROLE_PERMISSIONS.cajero],
  },
  // {
  //   href: "/finanzas",
  //   icon: "fa-dollar-sign",
  //   label: "Finanzas",
  //   roles: [userRoles.administrador, userRoles.propietario],
  // },
  // {
  //   href: "/estadisticas",
  //   icon: "fa-chart-bar",
  //   label: "Estadísticas",
  //   roles: [userRoles.administrador, userRoles.propietario],
  // },
  // {
  //   href: "/usuarios",
  //   icon: "fa-user-friends",
  //   label: "Usuarios",
  //   roles: [userRoles.administrador, userRoles.propietario],
  // },
  {
    href: "/user",
    icon: "fa-user-cog",
    label: "Gestión Usuarios",
    roles: [ROLE_PERMISSIONS.administrador],
  },
  {
    href: "/configuraciones",
    icon: "fa-cog",
    label: "Configuraciones",
    roles: [ROLE_PERMISSIONS.administrador],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { logout, user, hasPermission } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => user && hasPermission(item.roles as unknown as string[]))

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992)
      if (window.innerWidth < 992) {
        setExpanded(false)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && expanded && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setExpanded(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${expanded ? "expanded" : ""}`}
        style={{
          width: expanded ? "240px" : "70px",
          transition: "width 0.3s ease",
          zIndex: 1050,
        }}
      >
        {/* Toggle button */}
        <div className="p-3 d-flex justify-content-center">
          <button
            className="btn btn-link text-white border-0 p-0"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`fas ${expanded ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        {/* Navigation items */}
        <div className="mt-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-item ${location.pathname === item.href ? "active" : ""} ${
                item.highlight && location.pathname === item.href ? "highlight" : ""
              }`}
              onClick={() => isMobile && setExpanded(false)}
            >
              <div className="sidebar-icon">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <span className={`${expanded ? "d-inline" : "d-none"}`} style={{ opacity: expanded ? 1 : 0 }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Spacer to push logout to bottom */}
        <div className="flex-grow-1 d-flex flex-column mt-auto">
          {/* Role indicator */}
          <div className={`text-center mb-2 px-2 ${expanded ? "d-block" : "d-none"}`}>
            <span
              className={`badge ${user?.role === "ADMINISTRADOR" ? "bg-danger" : user?.role === "CAJERO" ? "bg-primary" : "bg-secondary"} text-white`}
            >
              {user?.role === "ADMINISTRADOR"
                ? "Propietario"
                : user?.role === "CAJERO"
                  ? "Administrador"
                  : "Cajero"}
            </span>
          </div>

          {/* Logout button */}
          <button onClick={logout} className="sidebar-item border-0 bg-transparent mb-3" title="Cerrar sesión">
            <div className="sidebar-icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <span className={`${expanded ? "d-inline" : "d-none"}`} style={{ opacity: expanded ? 1 : 0 }}>
              Salir
            </span>
          </button>
        </div>
      </div>

      {/* Mobile toggle button (outside sidebar) */}
      {isMobile && !expanded && (
        <button
          className="btn btn-dark position-fixed top-0 start-0 m-2 d-lg-none"
          style={{ zIndex: 1030 }}
          onClick={() => setExpanded(true)}
          aria-label="Open sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
      )}
    </>
  )
}
