import { useEffect, useState } from "react";
import { getCategories, createCategories, deleteCategories } from "./categories.service.js";
import { useForm } from "react-hook-form";

export function CategoryPage() {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit} = useForm()

  useEffect(() => {
    async function fetchCategory(){
      setLoading(true)
      const result = await getCategories()
      setCategory(result.data)
      setLoading(false)
    }
    fetchCategory()
  }, [])

  async function onSubmit(data) {
    const result =await createCategories(data)
    console.log(result)
    setCategory([result.data, ...category])
  }

  async function onHandleDelete(id){
    await deleteCategories(id)
    setCategory(category.filter(item => item.id !== id))
  }

  if (loading) return <p>Loading...</p>
  if (!category) return null 

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