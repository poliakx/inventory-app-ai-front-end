import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore.js";


export const ProtectedRoute = () => {
  const token = useAuthStore((store) => store.token);

  if (token){
    return <Outlet/>
  } else  {
    return <Navigate to ="/login"/>
  }
}