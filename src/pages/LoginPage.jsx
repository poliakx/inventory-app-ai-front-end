import { useEffect } from "react";
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
    try{
   const response = await login(data);
    setToken(response.data.accessToken)
    navigate('/dashboard')
  } catch (error) {
    console.error(error)
    }
  };

  const token = useAuthStore((store) => store.token);

  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token])
  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="email" {...register('email')}>
      </input>
      {errors.email && <span>{errors.email.message}</span>}

      <input placeholder="password" {...register('password')}>
      </input>
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">click</button>
    </form>
  );
};