import { z } from "zod"

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().optional(),
  ingredients: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().positive()
    })
  ).min(1),
  instructions: z.string().optional(),
  photoUrl: z.string().optional(),
  portions: z.coerce.number().int().nonnegative("Portions can't be negative").optional(),
  yieldWeight: z.coerce.number().nonnegative().optional(),
  salePrice: z.coerce.number().nonnegative().optional(),
  yieldUnit: z.enum(["g", "ml", "pcs"]).default("g")
})