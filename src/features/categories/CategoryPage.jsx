import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/TableSkeleton.jsx";
import { getCategories, createCategories, deleteCategories } from "./categories.service.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryPage() {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true)
        const result = await getCategories()
        setCategory(result.data)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [])

  async function onSubmit(data) {
    const result = await createCategories(data)
    setCategory([result.data, ...category])
    toast.success('Category created')
    reset()
  }

  async function onHandleDelete(id) {
    await deleteCategories(id)
    setCategory(category.filter(item => item.id !== id))
    toast.success('Category deleted')
  }

  if (loading) return <TableSkeleton rows={5} />

  if (!category) return null

  if (category.length === 0) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <p className="text-sm text-muted-foreground">No categories yet. Create your first one.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <Input placeholder="Category name..." {...register("name")} className="w-64" />
          <Button type="submit">Add</Button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 max-w-sm">
        <Input placeholder="New category..." {...register("name")} />
        <Button type="submit">Add</Button>
      </form>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {category.map(cat => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHandleDelete(cat.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
