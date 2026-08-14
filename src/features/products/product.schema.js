import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required"'),
  price: z.coerce.number().positive("Price must greater than 0"),
  quantity: z.coerce.number().nonnegative("Quantity can`t be negative")
})