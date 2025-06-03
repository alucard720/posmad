import { useState } from "react"
import { useSalesHistory } from "../../hooks/use-analytics"
import { useUsers } from "../../hooks/use-users"
import { useAuth } from "../../contexts/auth-context"
import { RoleGuard } from "../analitica/role-guard"
import type { UserRoleId, UserRole } from "../../types/User"
import { getRoleById } from "../../types/User"

export default function SalesHistoryPage() {
  const { user } = useAuth()
  const { users } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeller, setSelectedSeller] = useState("all")
  const currentUserRole = getRoleById(user?.role as UserRoleId)
  const { salesHistory, loading, fetchSalesHistory } = useSalesHistory(
    selectedSeller === "all" ? undefined : selectedSeller,
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(amount)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)

  const filteredSales = salesHistory.filter((sale) =>
    [sale.customer.name, sale.seller.name, sale.code]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeller(e.target.value)
  }

  const handleRefresh = () => {
    fetchSalesHistory({ search: searchTerm })
  }

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "PROPIETARIO"]}
     currentUserRole={currentUserRole}>
      <div className="container py-4">
        <h2 className="mb-4">Historial de ventas</h2>

        {/* Search & Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
          <div className="input-group w-auto">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              className="form-control"
              placeholder="Buscar cliente, código o vendedor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="form-select w-auto" value={selectedSeller} onChange={handleSellerChange}>
            <option value="all">Todos los vendedores</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            <i className="fas fa-sync-alt me-2"></i> Actualizar
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Items</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td><i className="fas fa-receipt me-2 text-secondary" />{sale.code}</td>
                  <td>{formatDate(sale.date)}</td>
                  <td>{sale.customer.name}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center" style={{ width: 24, height: 24, fontSize: 12 }}>
                        {sale.seller.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      {sale.seller.name}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{sale.itemsCount} items</span>
                  </td>
                  <td>{formatCurrency(sale.total)}</td>
                  <td><span className="badge bg-light text-dark">Venta</span></td>
                  <td>{sale.observations || "-"}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="text-center text-muted py-3">
              No se encontraron ventas que coincidan con los filtros aplicados.
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}
