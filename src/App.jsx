import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './features/auth/LoginPage.jsx'
import { DashboardPage } from './features/dashboard/DashboardPage.jsx'
import {ProductsPage} from './features/products/ProductsPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppLayout } from './components/layouts/AppLayout.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout/>}>
          <Route path="/dashboard" element={<DashboardPage/>} />
           <Route path="/products" element={<ProductsPage/>} />
          </Route>
        </Route>
        <Route path="/login" element ={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
    )
}

export default App
