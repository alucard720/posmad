import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Suspense , lazy} from "react"
import { AppProvider } from "./contexts/app-provider"
import { AuthProvider } from "./contexts/auth-context"
import ProtectedRoute from "./components/proctect-route"
import Loading from "./loading"
import NotFoundPage from "./not-found"
import LoginPage from "./pages/login"

// Lazy load pages
// const LoginPage = lazy(() => import("./pages/login"))
const DashboardLayout = lazy(() => import("./pages/dashboard-layout"))
const HomePage = lazy(() => import("./pages/home"))
// const ProductsPage = lazy(() => import("./pages/products"))
// const OrdersPage = lazy(() => import("./pages/orders"))
// const UsersPage = lazy(() => import("./pages/users"))
// const NotFoundPage = lazy(() => import("./pages/not-found"))

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomePage />} />
                {/* <Route path="productos" element={<ProductsPage />} />
                <Route path="pedidos" element={<OrdersPage />} />
                <Route path="usuarios" element={<UsersPage />} /> */}
              </Route> 

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
