
import { useAuth } from "../contexts/auth-context"
import UserManagement from "../components/user-management"
import Sidebar from "../components/sidebar"
import { ROLES } from "../types/roles"

export default function UserPage() {
  const { hasPermission } = useAuth()
  const isAdmin = hasPermission(ROLES.ADMIN)

  return (
    <>
      {isAdmin && (
        
          <div className="container">
            <div className="row">
                <div className="col-2"><Sidebar /></div>
                <div className="col-12"> <UserManagement /></div>               
             
            </div>
         </div>
        
        
      )}
    
    </>
  )
}
