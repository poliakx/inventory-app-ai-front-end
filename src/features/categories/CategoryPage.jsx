import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/TableSkeleton.jsx";
import { getCategories, createCategories, deleteCategories } from "./categories.service.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CategoryPage() {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit} = useForm()

  useEffect(() => {
    async function fetchCategory(){
      try{
        setLoading(true)
        const result = await getCategories()
        setCategory(result.data)
      }finally{
        setLoading(false)
      }
    }
    fetchCategory()
  }, [])

  async function onSubmit(data) {
    const result = await createCategories(data)
    setCategory([result.data, ...category])
    toast.success('Category created')
  }

  async function onHandleDelete(id){
    await deleteCategories(id)
    setCategory(category.filter(item => item.id !== id))
    toast.success('Category deleted')
  }
  
  if(loading) return <TableSkeleton rows={5} />
  
  if (!category) return null 

  if (category.length === 0) return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")}/>

        <button type="submit">Create new category</button>
        </form>
  )

  return(
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name")}/>

        <button type="submit">Save</button>
      </form>
      <table>
        <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
    <tbody>
      {category.map(category => <tr key={category.id}>
        <td>
        {category.name}
        <button onClick={() => onHandleDelete(category.id)}>Delete</button>
      </td>
      </tr>)}
    </tbody>
      </table>
    </div>
  )
}