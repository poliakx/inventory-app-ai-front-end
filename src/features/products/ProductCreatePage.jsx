import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { createProduct } from "./products.service.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductCreatePage() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  async function onHandleSubmit(data) {
    await createProduct({
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
    })
    toast.success('Product created')
    navigate("/products")
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">Add a new ingredient to your inventory</p>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. Tomatoes" {...register("name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="any" placeholder="0.00" {...register("price")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" placeholder="0" {...register("quantity")} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit">Create product</Button>
          <Button variant="ghost" asChild>
            <Link to="/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
