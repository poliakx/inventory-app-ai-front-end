import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../services/auth.js";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

export function LoginPage () {
  const { setToken } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();

  async function onSubmit(data){
   const response = await login(data);
    setToken(response.data.accessToken)
    navigate('/dashboard')
  };
  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')}>
      </input>
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')}>
      </input>
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit"></button>
    </form>
  )
}