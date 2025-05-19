import { Header } from "../components/header"
import { CartSidebar } from "../components/cart-sidebar"
import { HomepageContent } from "../components/homepage-content"

export default function HomePage() {
  return (
    <>
      <Header title="Vender" />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="flex-grow-1 overflow-auto p-3">
          <HomepageContent />
        </div>
        <CartSidebar />
      </div>
    </>
  )
}
