import { NavLink, Outlet,  useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function AppLayout() {

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return(
    <div className="flex row">
  <aside className="left">
    <nav>
    <NavLink to="/dashboard">Dashboard</NavLink>
    <NavLink to="/products">Products</NavLink>
    <NavLink to="/categories">Categories</NavLink>
    </nav>
  </aside>
  <div className="flex column">
    <header className="top">
    <button onClick={() =>{logout(); navigate('/login')}}>Logout</button>
    </header>
    <main>
      <Outlet></Outlet>
    </main>
  </div>
</div>
  )
}

