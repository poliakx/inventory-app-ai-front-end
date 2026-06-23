import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsById } from "./products.service.js";

export  function ProductDetailsPage() {

  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)

  useEffect(() =>{
  async function fetchProductById (id){
    setLoading(true)
    const result = await getProductsById(id)
    setProduct(result)
    setLoading(false)
  }

  fetchProductById(id)
}, [])

  if(loading) return <p>loading...</p>
  if(!product) return null
  return(
    <div>
      <div>{product.data.name}</div>
      <div>{product.data.price}</div>
      <div>{product.data.quantity}</div>
    </div>
  )
}

