import { Outlet,  useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function AppLayout() {

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return(
    <div className="flex row">
  <aside className="left">
    <nav>

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

