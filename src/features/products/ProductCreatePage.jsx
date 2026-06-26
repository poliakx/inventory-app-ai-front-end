import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createProduct } from "./products.service.js";

export function ProductCreatePage(){

  const {register, handleSubmit} = useForm()
  const navigate = useNavigate()

  async function onHandleSubmit(data){
    await createProduct({
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity)
    })
    navigate("/products")
  }
  return(
    <div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <input placeholder="input" type="text" {...register("name")}/>
        <input placeholder="input" type="number" step="any" {...register("price")}/>
        <input placeholder="input" type="number" {...register("quantity")}/>

        <button type="submit">Save</button>
      </form>
    </div>
  )
}