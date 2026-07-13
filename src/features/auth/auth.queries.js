import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { login, register } from "./auth.service.js"
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

export const useRegisterMutation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: register,
    onSuccess:() => {
      toast.success('Account created - please login')
      navigate('/login')
    }
  })
}