import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
})


export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
