
import { useAuth } from "../contexts/auth-context"
import { Header } from "../components/layout/header"
import RecordVentas from "../components/historia-ventas/record-ventas"
import Sidebar from "../components/layout/sidebar"
import { ROLES } from "../types/roles"

export default function HistorialVentas() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(ROLES.ADMIN)

  return (
    <>   
      {isAdmin && ( 
        <div>
          {/* <Header title="Usuarios" />         */}
          <div className="d-flex flex-grow-1 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1  p-4" style={{transition: "margin-left 0.3s ease"}}>
              <RecordVentas/>                     
            </div>
          </div>
        </div>
      )}
    
    </>
  )
}