import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './features/auth/LoginPage.jsx'
import { DashboardPage } from './features/dashboard/DashboardPage.jsx'
import { ProductsPage } from './features/products/ProductsPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppLayout } from './components/layouts/AppLayout.jsx'
import { ProductDetailsPage } from './features/products/ProductDetailsPage.jsx'
import { getCurrentUser } from './features/auth/auth.service.js'
import { useAuthStore } from './features/auth/authStore.js'

function App() {

  const { token, logout, setAuthLoading, isAuthLoading } = useAuthStore()

  useEffect(() =>{
    async function currentUser(){
      try{
        if(token){
          setAuthLoading(true)
          await getCurrentUser();
          setAuthLoading(false)
        } else {
          logout()
          setAuthLoading(false)
        }
      } catch(error){
        logout()
        setAuthLoading(false)
      }
    }
    currentUser()
  }, [])

  if (isAuthLoading) return null
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout/>}>
          <Route path="/dashboard" element={<DashboardPage/>} />
           <Route path="/products" element={<ProductsPage/>} />
           <Route path="/products/:id" element={<ProductDetailsPage/>}/>
          </Route>
        </Route>
        <Route path="/login" element ={<LoginPage/>} />  
      </Routes>
    </BrowserRouter>
    )
}

export default App
