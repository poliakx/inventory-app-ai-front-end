import {z} from "zod"

export const optionalPositiveNumber = z.preprocess((val) => {
    if(val === "" || val === null){
      return undefined
    } else {
      return val
    }},  z.coerce.number().positive().optional())