import { z } from "zod"
import { optionalPositiveNumber } from "@/lib/zod.js"

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
  yieldWeight: optionalPositiveNumber,
  salePrice: optionalPositiveNumber,
  portionWeight: optionalPositiveNumber
})
