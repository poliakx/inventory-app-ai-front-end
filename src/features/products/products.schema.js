import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  quantity: z.coerce.number().nonnegative("Quantity can't be negative"),
  unit: z.enum(["g", "kg", "ml", "l", "pcs"]),
  avgWeightGrams: z.preprocess((val) => {
    if(val === "" || val === null){
      return undefined
    } else {
      return val
    }}, z.coerce.number().positive().optional()),
  avgVolumeMl: z.preprocess((val) => {
    if(val === "" || val === null){
      return undefined
    } else {
      return val
    }}, z.coerce.number().positive().optional())
})