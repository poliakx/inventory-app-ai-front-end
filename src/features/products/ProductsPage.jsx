import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TableSkeleton } from "@/components/TableSkeleton.jsx";
import { deleteProduct, getProducts } from "./products.service.js";
import { toast } from "sonner";

export function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchProducts(){
      setLoading(true)
      try{
        const result = await getProducts()
        setProducts(result.data.products)
      } finally{
        setLoading(false)
      }
    }

    fetchProducts()
  }, []);

  const filteredProducts = products.filter(
    p => p.name.toLowerCase().includes(search.toLocaleLowerCase())
  );

  async function handleDelete(id){
    await deleteProduct(id)
    setProducts(products.filter(item => item.id !== id))
    toast.success('Product deleted')
  }
 
  if (loading) return (
    <div>
      <TableSkeleton rows={5}/>
      </div>
  )
  if(products.length === 0) return (<div>
    <button><Link to={"/products/new"}>Create product</Link></button>
  </div>)
  return(
    <div>
      <button><Link to={"/products/new"}>Create product</Link></button>
    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>

    {filteredProducts.length === 0 
      ? <p>No products found</p>:
    
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>

      
     
      <tbody >
        {filteredProducts.map(product => <tr key={product.id}>
         <td>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
          <button onClick={() => handleDelete(product.id)}>Delete</button>
          </td>
         <td>{product.price}</td>
         <td>{product.quantity}</td> 
          </tr>)}
      </tbody>
      </table>
}
    </div>
  )
}
