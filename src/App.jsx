import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
        </Route>
        <Route path="/login" element ={<LoginPage/>} />

      </Routes>
    </BrowserRouter>
    )
}

export default App
