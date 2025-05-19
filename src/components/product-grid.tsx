"use client"

import { ProductCard } from "./product-card"
import { useProducts } from "../contexts/product-context"

export function ProductGrid() {
  const { filteredProducts, loading, error } = useProducts()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-2 mb-0">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error: </strong>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
      {filteredProducts.map((product) => (
        <div className="col" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
      <div className="col">
        <button
          className="btn btn-success product-card d-flex align-items-center justify-content-center"
          onClick={() => {
            // This would typically open a modal to add a new product
            alert("Añadir nuevo producto")
          }}
        >
          <i className="fas fa-plus fa-2x"></i>
        </button>
      </div>
    </div>
  )
}
