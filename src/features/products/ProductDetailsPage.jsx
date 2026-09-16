import { useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
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
import { TableSkeleton } from "@/components/TableSkeleton";
import { productSchema } from "./products.schema.js";
import { useProduct, useUpdateProduct } from "./products.queries.js";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProductDetailsPage() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const { data, isLoading } = useProduct(id);

  const product = data?.data ?? null;

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        avgWeightGrams: product.avgWeightGrams,
      });
    }
  }, [product]);

  const unit = watch("unit");

  const updateMutation = useUpdateProduct();

  function onSubmit(data) {
    updateMutation.mutate({ id, data });
  }

  if (isLoading) return <TableSkeleton rows={3} />;
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted-foreground mb-4">Product not found</p>
        <Button asChild>
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <p className="text-sm text-muted-foreground">Edit product details</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="any" {...register("price")} />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">
            Quantity{unit ? ` (${unit})` : ""}
          </Label>
          <Input id="quantity" type="number" {...register("quantity")} />
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
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Save changes"}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
