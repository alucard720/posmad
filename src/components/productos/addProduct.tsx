import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faUpload, faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { mockCategories } from "../../lib/data"

export default function NewProductPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    promotionalPrice: "",
    category: "",
    labelName: "",
    description: "",
    code: "",
    cost: "",
    unit: "Unidad",
    currentStock: "",
    minStock: "",
    trackStock: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product data:", formData)
    navigate("/products")
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Registre sus productos</h1>

      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/products")}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Volver
      </button>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left column - Image */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column gap-4">
                <div className="border border-secondary border-dashed p-4 text-center rounded bg-light">
                  <div className="bg-secondary text-white p-3 rounded mb-2">Label</div>
                  <div className="fw-bold">{formData.name || "Nombre del producto"}</div>
                  <div className="text-muted">RD$0.00</div>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary w-100">
                    <div className="bg-secondary rounded me-2 d-inline-block" style={{ width: 16, height: 16 }}></div>
                    Color de la etiqueta
                  </button>
                  <button type="button" className="btn btn-outline-secondary w-100">
                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                    Fotos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="col-lg-8">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card p-3">
                  <div className="mb-3">
                    <label className="form-label">Nombre del producto</label>
                    <input className="form-control" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input type="number" className="form-control" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Opcionales</label>
                    <input type="number" className="form-control" value={formData.promotionalPrice} onChange={(e) => handleInputChange("promotionalPrice", e.target.value)} />
                    <div className="form-text">de <s>$10.00</s> para $5.00</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}>
                      <option>Seleccionar categoría</option>
                      {mockCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre de la etiqueta</label>
                    <input className="form-control" value={formData.labelName} onChange={(e) => handleInputChange("labelName", e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
                    <button type="button" className="btn btn-sm btn-outline-secondary mt-2">
                      <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                      Sugerir descripción
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Código del producto</label>
                    <input className="form-control" value={formData.code} onChange={(e) => handleInputChange("code", e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Costo</label>
                    <input type="number" className="form-control" value={formData.cost} onChange={(e) => handleInputChange("cost", e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vender por</label>
                    <select className="form-select" value={formData.unit} onChange={(e) => handleInputChange("unit", e.target.value)}>
                      <option value="Unidad">Unidad</option>
                      <option value="Kilogramo">Kilogramo</option>
                      <option value="Litro">Litro</option>
                      <option value="Metro">Metro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stock Section */}
              <div className="col-md-6">
                <div className="card p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Stock</h5>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.trackStock}
                        onChange={(e) => handleInputChange("trackStock", e.target.checked)}
                      />
                    </div>
                  </div>
                  <small className="text-muted mb-3">Controlar stock del producto</small>
                  <div className="row">
                    <div className="col">
                      <label className="form-label">Stock actual</label>
                      <input type="number" className="form-control" value={formData.currentStock} onChange={(e) => handleInputChange("currentStock", e.target.value)} disabled={!formData.trackStock} />
                    </div>
                    <div className="col">
                      <label className="form-label">Stock mínimo</label>
                      <input type="number" className="form-control" value={formData.minStock} onChange={(e) => handleInputChange("minStock", e.target.value)} disabled={!formData.trackStock} />
                    </div>
                  </div>
                </div>

                <div className="card p-3">
                  <h5>Historial de movimientos</h5>
                  <button type="button" className="btn btn-outline-primary mt-3 w-100">Mostrar resultados</button>
                </div>
              </div>
            </div>

            <div className="col-md-6 d-flex gap-3" style={{ marginTop: "10px" }}  >
              <button type="submit" className="btn btn-primary flex-fill">Guardar Producto</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/productos")}>Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
