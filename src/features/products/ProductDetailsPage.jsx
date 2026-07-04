import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { getProductsById, updateProduct } from "./products.service.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/TableSkeleton";

export function ProductDetailsPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    async function fetchProductById(id) {
      setLoading(true)
      try {
        const result = await getProductsById(id)
        setProduct(result)
      } finally {
        setLoading(false)
      }
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

  async function onSubmit(data) {
    await updateProduct(id, data)
    toast.success('Product updated')
  }

  if (loading) return <TableSkeleton rows={3} />
  if (!product) return null

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{product.data.name}</h1>
        <p className="text-sm text-muted-foreground">Edit product details</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="any" {...register("price")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" {...register("quantity")} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit">Save changes</Button>
          <Button variant="ghost" asChild>
            <Link to="/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
