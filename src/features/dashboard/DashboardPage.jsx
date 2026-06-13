import { useEffect, useState } from "react"
import { getProducts } from "@/features/products/products.service";

export function DashboardPage() {
  const [products, setProducts  ]= useState([]);

  useEffect(() =>{
    async function fetchData() {
      const res = await getProducts()
      setProducts(res.data.data.products)
    }
    fetchData()
  }, [])
    return (
      <div>
        <p>Total products: {products.length}</p>
        <p>Low stock: {products.filter(p => p.quantity < 10).length}</p>
      </div>
    )
}