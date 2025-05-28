"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { createUser, deleteUser, fetchUsers, updateUser } from "../services/user-service";
import type { User } from "../types/User";
import { ROLES, roleDisplayNames, } from "../types/roles";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const rolePermissions = {
  [ROLES.ADMIN]: {
    label: "Propietario",
    description: "Acceso completo al sistema, incluyendo configuraciones financieras y reportes avanzados.",
    canManage: [ROLES.ADMIN, ROLES.CAJERO, ROLES.PROPIETARIO],
    badge: "bg-danger",
    badgeClass: "bg-danger",
  },
  [ROLES.PROPIETARIO]: {
    label: "Administrador",
    description: "Acceso a la mayoría de funciones administrativas, excepto configuraciones financieras sensibles.",
    canManage: [ROLES.CAJERO],
    badge: "bg-primary",
    badgeClass: "bg-primary",
  },
  [ROLES.CAJERO]: {
    label: "Cajero",
    description: "Acceso limitado a ventas, pedidos y clientes.",
    canManage: [],
    badge: "bg-secondary",
    badgeClass: "bg-secondary",
  },
}




interface UserManagementProps {
  compact?: boolean;
}

export default function UserManagement({ compact = false }: UserManagementProps) {
  const { user, isAuthenticated, hasPermission , register} = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const roleBadgeColors: { [key: string]: string } = {
    ADMIN: "bg-primary",
    CAJERO: "bg-info",
    MANAGER: "bg-success",
    SUPERVISOR: "bg-warning",
    EMPLOYEE: "bg-secondary",
    CUSTOMER: "bg-dark",
    GUEST: "bg-light text-dark",
    OTHER: "bg-secondary",
    // Add more as needed
  };
  


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
        setIsLoading(false);
        return;
      }

      try {
        console.log("UserManagement: Obteniendo usuarios");
        const fetchedUsers = await fetchUsers();
        console.log("UserManagement: Usuarios obtenidos", fetchedUsers);
        if (fetchedUsers.length > 0) {
          console.log("UserManagement: First user structure", {
            id: fetchedUsers[0].id,
            role: fetchedUsers[0].role,
            fullname: fetchedUsers[0].fullname,
            email: fetchedUsers[0].email,
            enabled: fetchedUsers[0].enabled,
            createdAt: fetchedUsers[0].createdAt,
          });
        }
        console.log("UserManagement: Roles received", fetchedUsers.map(u => ({
          id: u.id,
          role: u.role,
          type: typeof u.role,
          hasRole: u.hasOwnProperty("role"),
        })));
        setUsers(fetchedUsers);
        setError(null);
      } catch (err: any) {
        console.error("UserManagement: Error", err);
        setError(err.message || "No se pudieron cargar los usuarios. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [isAuthenticated, hasPermission, user?.role, navigate]);
  
 const filteredUsers = users.filter((user) => 
  user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
  user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
  user.role?.toLowerCase().includes(searchTerm.toLowerCase())
 );


 const displayedUsers = compact ? filteredUsers.slice(0, 5) : filteredUsers;


 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  if (!currentUser) return;
  setCurrentUser({
    ...currentUser,
    [name]: value,
    // Ensure required fields are never undefined
    id: currentUser.id ?? "",
    email: currentUser.email ?? "",
    fullname: currentUser.fullname ?? "",
    password: currentUser.password ?? "",
    role: currentUser.role ?? "",
    enabled: typeof currentUser.enabled === "boolean" ? currentUser.enabled : true,
    createdAt: currentUser.createdAt ?? new Date().toISOString(),
  });
 };


const handleAddUser = () => {
  setCurrentUser({
    id: "",
    email: "",
    fullname: "",
    password: "",
    role: "",
    enabled: true,
    createdAt: new Date().toISOString(),
  });
  setShowModal(true);
};

const handleEditUser = (user: User) =>{
  setCurrentUser({
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    password: "",
    role: user.role,
    enabled: user.enabled,
    createdAt: user.createdAt,
  });
  setShowModal(true);
};
  

const handleDeleteUser = async (id: string) => {
  if(window.confirm("¿Estás seguro de querer eliminar este usuario?")){
    try{
      const result = await deleteUser(id);
      if(result){
      setUsers(users.filter(user => user.id !== id));
      setShowModal(false);
      } else {
        throw new Error(result || "No se pudo eliminar el usuario. Intenta de nuevo.");
      }
    } catch (err: any) {
      console.error("UserManagement: Error al eliminar usuario", err);
      setError(err.message || "No se pudo eliminar el usuario. Intenta de nuevo.");
    }
  }
}


const handleSubmit = async (e: React.FormEvent) =>{
  e.preventDefault();
  if(!currentUser){
    return;
  }
  try{
    if(currentUser.id){
      const updatedUser = await updateUser(currentUser.id,{
        fullname: currentUser.fullname,
        email: currentUser.email,
        role: currentUser.role,
        ...(currentUser.password ? {password : currentUser.password}: {})
      });
      if(updatedUser){
        setUsers(users.map((user) => (user.id === currentUser.id ? updatedUser : user)));        
      } else {
        throw new Error("No se pudo actualizar el usuario. Intenta de nuevo.");
      }
    } else {
      const newUser = await createUser({
        fullname: currentUser.fullname,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        enabled: currentUser.enabled,
        createdAt: currentUser.createdAt
      })
      if (newUser){
        setUsers([...users, newUser])
        await register(
          currentUser.fullname,
          currentUser.email,
          currentUser.password || "",
          currentUser.role || "",
          currentUser.enabled,
          
        )
      }else{
        throw new Error("No se pudo crear el usuario. Intenta de nuevo.");
      }
    }
  } catch (err: any) {
    console.error("UserManagement: Error al crear/actualizar usuario", err);
    setError(err.message || "No se pudo crear/actualizar el usuario. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
  setShowModal(false);
}

  if (!isAuthenticated) {
    return null; // Redirect handled in useEffect
  }

  // return (
  //   <div className="container p-4">
  //     <div className="d-flex justify-content-between align-items-center mb-4">
  //       <h2 className="fw-bold">Gestión de Usuarios</h2>
  //       <button
  //         className="btn btn-success"
  //         onClick={handleCreateUser}
  //         disabled={loading}
  //       >
  //         <FontAwesomeIcon icon={faPlus} className="me-2" />
  //         Crear Usuario
  //       </button>
  //     </div>

  //     {loading && (
  //       <div className="text-center p-4">
  //         <FontAwesomeIcon icon={faSpinner} spin size="2x" />
  //         <p className="mt-2">Cargando usuarios...</p>
  //       </div>
  //     )}

  //     {error && (
  //       <div className="alert alert-danger" role="alert">
  //         {error}
  //         <button className="btn btn-outline-danger btn-sm ms-3" onClick={()=> window.location.reload()}>
  //           Reintentar
  //         </button>
  //       </div>
  //     )}

  //     {!loading && !error && (
  //       <>
  //         {users.length === 0 ? (
  //           <div className="alert alert-info" role="alert">
  //             No hay usuarios disponibles.
  //           </div>
  //         ) : (
  //           <div className="table-responsive">
  //             <table className="table table-striped table-hover">
  //               <thead className="table-dark">
  //                 <tr>
  //                   <th scope="col">ID</th>
  //                   <th scope="col">Nombre Completo</th>
  //                   <th scope="col">Correo</th>
  //                   <th scope="col">Rol</th>
  //                   <th scope="col">Estado</th>
  //                   <th scope="col">Creado</th>
  //                 </tr>
  //               </thead>
  //               <tbody>                
  //                 {users.map((u) => (
  //                   console.log("UserManagement: Rendering user",{id: u.id, role: u.role, displayName: roleDisplayNames[u.role as keyof typeof roleDisplayNames]}),                  
  //                   <tr key={u.id}>
  //                     <td>{u.id}</td>
  //                     <td>{u.fullname}</td>
  //                     <td>{u.email}</td>
  //                     <td>
  //                       {typeof u.role === "string" && u.role in roleDisplayNames
  //                         ? roleDisplayNames[u.role as keyof typeof roleDisplayNames]
  //                         : `Rol desconocido (UUID: ${u.role || 'undefined'})`}
  //                     </td>
  //                     <td>
  //                       <span
  //                         className={`badge ${
  //                           u.enabled ? "bg-success" : "bg-secondary"
  //                         }`}
  //                       >
  //                         {u.enabled ? "Activo" : "Inactivo"}
  //                       </span>
  //                     </td>
  //                     <td>
  //                       {new Date(u.createdAt).toLocaleDateString("es-DO", {
  //                         year: "numeric",
  //                         month: "long",
  //                         day: "numeric",
  //                       })}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );


  ///////////////test2////
  if (isloading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-outline-danger btn-sm ms-3" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }
   
  return (
    <div>
      {!compact && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 fw-semibold">Gestió de Usuarios</h2>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleAddUser}>
            <i className="fas fa-plus"></i>
            <span>Añadir Usuario</span>
          </button>
        </div>
      )}

      {!compact && (
        <div className="mb-4 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className={compact ? "" : "card shadow-sm"}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Último Acceso</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-medium">{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>
                    <span className={`badge ${roleBadgeColors[user.role ?? ""] ?? "bg-secondary"}`}>
  {typeof user.role === "string" && user.role in roleDisplayNames
    ? roleDisplayNames[user.role as keyof typeof roleDisplayNames]
    : `Rol desconocido (${user.role ?? "undefined"})`}
</span>

                    </td>
                    {!compact && <td className="text-secondary">{user.createdAt || "-"}</td>}
                    <td>
                      <span className={`badge ${user.enabled ? "bg-success" : "bg-danger"}`}>
                        {user.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(user)}>
                        <i><FontAwesomeIcon icon={faEdit} /></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
                        <i><FontAwesomeIcon icon={faTrash} /></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={compact ? 5 : 6} className="text-center py-4">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {compact && filteredUsers.length > 5 && (
          <div className="p-3 text-center border-top">
            <Link to="/usuarios" className="btn btn-sm btn-outline-primary">
              Ver todos los usuarios <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        )}

        {compact && (
          <div className="p-2 text-end border-top">
            <button className="btn btn-success btn-sm" onClick={handleAddUser}>
              <i><FontAwesomeIcon icon={faPlus} /></i> Añadir Usuario
            </button>
          </div>
        )}
      </div>


      <h3 className="fs-5 fw-semibold mb-3">Roles y Permisos</h3>
      <div className="row">
        {Object.entries(rolePermissions).map(([role, info]) => (
          <div className="col-md-4 mb-3" key={role}>
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{info.label}</h5>
                <span className={`badge ${info.badge}`}>{role}</span>
              </div>
              <div className="card-body">
                <p className="card-text">{info.description}</p>
                <h6 className="mt-3 mb-2">Puede gestionar:</h6>
                <ul className="list-unstyled">
                  {info.canManage.length > 0 ? (
                    info.canManage.map((managedRole) => (
                      <li key={managedRole} className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {rolePermissions[managedRole]?.label || managedRole}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">
                      <i className="fas fa-times-circle me-2"></i>
                      No puede gestionar usuarios
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{currentUser?.id ? "Editar Usuario" : "Añadir Usuario"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={currentUser?.fullname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={currentUser?.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={currentUser?.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="cashier">Cajero</option>
                      <option value="administrator">Administrador</option>
                      <option value="manager">Gerente</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="employee">Empleado</option>
                      <option value="customer">Cliente</option>
                      <option value="guest">Invitado</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      {currentUser?.id ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={currentUser?.password}
                      onChange={handleInputChange}
                      required={!currentUser?.id}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={currentUser?.enabled ? "Activo" : "Inactivo"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {currentUser?.id ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  




}