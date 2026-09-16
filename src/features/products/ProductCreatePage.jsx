import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema } from "./products.schema.js";
import { useCreateProducts } from "./products.queries.js";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProductCreatePage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });
  const navigate = useNavigate();

  const createMutation = useCreateProducts();

  const unit = watch("unit");

  function onHandleSubmit(data) {
    createMutation.mutate(data, {
      onSuccess: () => navigate("/products"),
    });
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">
          Add a new ingredient to your inventory
        </p>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. Tomatoes" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="any"
            placeholder="0.00"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">
            Quantity{unit ? ` (${unit})` : ""}
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            {...register("quantity")}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="l">l</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>
        <div>
          {(unit === "pcs" || unit === "ml" || unit === "l") && (
            <div>
              <Label htmlFor="avgWeightGrams">Average Weight Grams</Label>
              <Input
                id="avgWeightGrams"
                type="number"
                {...register("avgWeightGrams")}
              />
              {errors.avgWeightGrams && (
                <p className="text-sm text-destructive">
                  {errors.avgWeightGrams.message}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create product"}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
