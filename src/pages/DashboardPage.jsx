import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export function DashboardPage() {
  const { logout } = useAuthStore()
  const navigate = useNavigate() 
    return (
      <div>
      <h1>Dashboard</h1>
      <button onClick={ () =>{ logout(), navigate('/login')}}>logout</button>
      </div>
    )
}