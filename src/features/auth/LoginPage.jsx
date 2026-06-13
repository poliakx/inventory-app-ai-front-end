import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "./authStore.js";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "./auth.service.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>Email</Label>
            <Input placeholder="email" {...register('email')} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
        <div>
            <Label>Password</Label>
            <Input placeholder="password" {...register('password')}/>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
    <Button type="submit">Login</Button>
  </form>
      </CardContent>
    </Card>
  </div>
  );
};