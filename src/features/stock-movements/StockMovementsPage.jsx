import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getProducts } from "../products/products.service.js";
import { createStockMovements, getMovementsByProductId } from "./stcok-movements.service.js";
import { toast } from "sonner";

export default function StockMovementsPage() {

  const [ products, setProducts ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ selectedProductId, setSelectedProductId] = useState(null)
  const [ history, setHistory] = useState([])
  const { register, handleSubmit } = useForm()

  useEffect(() =>{
    async function fetchProducts(){
      setLoading(true)
      const result = await getProducts()
      setProducts(result.data.products)
      setLoading(false)
    } 
    fetchProducts()
  }, [])

  useEffect(() =>{
    async function fetchMovementsHistory(){
      if(!selectedProductId) return 
      setLoading(true)
      const result = await getMovementsByProductId(selectedProductId)
      setHistory(result.data)
      setLoading(false)
    }
    fetchMovementsHistory()
  }, [selectedProductId])

  async function onSubmit(data){
      await createStockMovements({
        ...data,
        quantity: Number(data.quantity)
      })
      toast.success('Movement added')
  } 

  return(
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("productId")}>
          <option value="">Select product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select {...register("type")}>
          <option value="in">In</option>
          <option value="out">Out</option>
        </select>

        <input type="number" {...register('quantity')} />
        <button type="submit">Save</button>
        </form>

      <select onChange={(e) => setSelectedProductId(e.target.value)}>
        <option>Select product</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {loading ? <p>Loading</p> : <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody >
       {history.map(item => (
        <tr key={item.id}>
          <td>{item.type} </td>
          <td>{item.quantity}</td>
          <td>{item.createdAt}</td>
        </tr>
       ))}
      </tbody>
      </table>}
      
    </div>
  )
}