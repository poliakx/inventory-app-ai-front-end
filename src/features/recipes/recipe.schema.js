import { z } from "zod"

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.preprocess((val) => {
    if(val === "" || val === null){
      return undefined
    } else {
      return val
    }
  }, z.string().uuid().optional()),
  ingredients: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().positive()
    })
  ).min(1),
  instructions: z.string().optional(),
  photoUrl: z.preprocess((val) => {
    if(val === "" || val === null){
      return undefined
    } else {
      return val
    }
  }, z.string().url().optional()),
  yieldWeight: z.coerce.number().nonnegative().optional(),
  salePrice: z.coerce.number().nonnegative().optional(),
  yieldUnit: z.enum(["g", "ml", "pcs"]).default("g"),
  portionWeight: z.coerce.number().nonnegative().optional()
})