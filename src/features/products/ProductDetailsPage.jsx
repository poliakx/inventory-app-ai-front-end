import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { getProductsById, updateProduct } from "./products.service.js";

export  function ProductDetailsPage() {

  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const {register, handleSubmit, reset} = useForm()

  useEffect(() =>{
    async function fetchProductById (id){
      setLoading(true)
      const result = await getProductsById(id)
      setProduct(result)
      setLoading(false)
  }

  fetchProductById(id)
}, [])


  useEffect(() => {
  if (product) {
    reset({
      name: product.data.name,
      price: product.data.price,
      quantity: product.data.quantity
    })
  }
}, [product])

  async function onSubmit(data){
    await updateProduct(id, data)
  }

  if(loading) return <p>loading...</p>
  if(!product) return null
  return(
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")}/>
        <input type="text" {...register("price")}/>
        <input type="text" {...register("quantity")}/>

        <button type="submit">Save</button>
        </form>
      
    </div>

    
  )
}

