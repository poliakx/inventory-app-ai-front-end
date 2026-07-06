import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { login } from "./auth.service.js"
import { useAuthStore } from "./authStore.js"

export const useLoginMutation = () => {
  const setToken = useAuthStore((store) => store.setToken)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setToken(response.data.accessToken)
      navigate('/dashboard')
    }
  })
}