"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { fetchUsers } from "../services/user-service";
import type { User } from "../types/User";
import { ROLES, roleDisplayNames } from "../types/roles";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function UserManagement() {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUsers() {
      if (!isAuthenticated) {
        console.log("UserManagement: No autenticado, redirigiendo a /login");
        navigate("/");
        return;
      }

      if (!hasPermission(ROLES.ADMIN)) {
        console.log("UserManagement: Usuario sin rol ADMIN", { role: user?.role });
        setError("Acceso denegado: se requiere rol de administrador");
        setLoading(false);
        return;
      }

      try {
        console.log("UserManagement: Obteniendo usuarios");
        const fetchedUsers = await fetchUsers();
        console.log("UserManagement: Usuarios obtenidos", fetchedUsers);
        setUsers(fetchedUsers);
        setError(null);
      } catch (err: any) {
        console.error("UserManagement: Error", err);
        setError(err.message || "No se pudieron cargar los usuarios. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [isAuthenticated, hasPermission, user?.role, navigate]);

  const handleCreateUser = () => {
    // Placeholder for create user form/modal
    console.log("UserManagement: Iniciar creación de usuario");
    alert("Funcionalidad de creación de usuario en desarrollo");
  };

  if (!isAuthenticated) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Gestión de Usuarios</h2>
        <button
          className="btn btn-success"
          onClick={handleCreateUser}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Crear Usuario
        </button>
      </div>

      {loading && (
        <div className="text-center p-4">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No hay usuarios disponibles.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre Completo</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{typeof u.role === "string" && u.role in roleDisplayNames ? roleDisplayNames[u.role as keyof typeof roleDisplayNames] : "Rol desconocido"}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.enabled ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {u.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString("es-DO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}