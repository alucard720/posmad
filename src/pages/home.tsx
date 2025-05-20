import { Header } from "../components/header"
import { CartSidebar } from "../components/cart-sidebar"
import { SearchBar } from "../components/search-bar"
import { ProductGrid } from "../components/product-grid"

export default function HomePage() {
  return (
    <>
      <Header title="Vender" />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="flex-grow-1 overflow-auto p-3">
          {/* <HomepageContent /> */}
          <SearchBar />
          <ProductGrid />
        </div>
        <CartSidebar />
      </div>
    </>
  )
}
