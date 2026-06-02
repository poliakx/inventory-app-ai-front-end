import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/login" element ={<LoginPage/>} />

      </Routes>
    </BrowserRouter>
    )
}

export default App
