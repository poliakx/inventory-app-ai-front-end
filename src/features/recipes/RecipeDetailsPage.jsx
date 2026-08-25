import { useParams, Link } from "react-router-dom";
import { recipeSchema } from "./recipe.schema";
import { useRecipe, useUpdateRecipe } from "./recipes.queries.js";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { FieldError } from "@/components/FieldError";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useCategories } from "../categories/categories.queries";
import { useProducts } from "../products/products.queries";
import { InlineProductCreate } from "./InlineProductCreate";

export function RecipeDetailsPage() {
  const { id } = useParams();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: { ingredients: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const navigate = useNavigate();
  const { data, isLoading } = useRecipe(id);
  const { data: categoriesData } = useCategories();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { data: productsData } = useProducts();

  const categories = categoriesData?.data ?? [];
  const products = productsData?.data.products ?? [];
  const recipe = data?.data ?? null;

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        categoryId: recipe.categoryId,
        ingredients: recipe.ingredients,
        yieldUnit: recipe.yieldUnit,
        yieldWeight: recipe.yieldWeight,
        instructions: recipe.instructions,
        photoUrl: recipe.photoUrl,
        portions: recipe.portions,
        salePrice: recipe.salePrice,
      });
    }
  }, [recipe]);

  const updateMutation = useUpdateRecipe();

  const watchedIngredients = watch("ingredients");
  const watchedSalePrice = watch("salePrice");

  const liveFoodCost = watchedIngredients.reduce((sum, acc) => {
    const product = products.find((p) => p.id === acc.productId);
    if (!product) {
      return sum;
    }
    return sum + product.price * acc.quantity;
  }, 0);

  const liveFoodCostPercentage = () => {
    if (Number.isNaN(Number(watchedSalePrice)) || Number(watchedSalePrice) <= 0)
      return null;
    return (liveFoodCost / watchedSalePrice) * 100;
  };

  const onSubmit = (data) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => navigate("/recipes"),
      },
    );
  };

  if (isLoading) return <TableSkeleton rows={5} />;
  if (!recipe)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted-foreground mb-4">Recipe not found</p>
        <Button asChild>
          <Link to="/recipes">Back to recipes</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit recipe</h1>
        <p className="text-sm text-muted-foreground">{recipe.name}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Margherita Pizza"
            {...register("name")}
          />
          <FieldError error={errors.name} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Ingredients</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productId: "", quantity: "" })}
            >
              Add ingredient
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingProduct(true)}
            >
              New product
            </Button>
            {isAddingProduct && (
              <InlineProductCreate
                onCreated={(newProduct) => {
                  append({ productId: newProduct.id, quantity: "" });
                  setIsAddingProduct(false);
                }}
                onCancel={() => setIsAddingProduct(false)}
              />
            )}
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No ingredients yet — click "Add ingredient" to start
            </p>
          )}

          {fields.map((item, index) => (
            <div key={item.id} className="flex items-start gap-2">
              <div className="flex-1 space-y-1">
                <Controller
                  name={`ingredients.${index}.productId`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.ingredients?.[index]?.productId} />
              </div>

              <div className="w-28 space-y-1">
                <Input
                  type="number"
                  placeholder="Qty"
                  {...register(`ingredients.${index}.quantity`)}
                />
                <FieldError error={errors.ingredients?.[index]?.quantity} />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-1 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm">
            Food cost:{" "}
            <span className="font-medium">{liveFoodCost.toFixed(2)}</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructions">Instructions</Label>
          <Input
            id="instructions"
            placeholder="Preparation steps"
            {...register("instructions")}
          />
          <FieldError error={errors.instructions} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="categoryId" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((k) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError error={errors.categoryId} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="yieldUnit">Yield unit</Label>
            <Controller
              name="yieldUnit"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="yieldUnit" className="w-full">
                    <SelectValue placeholder="Yield unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError error={errors.yieldUnit} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            placeholder="https://..."
            {...register("photoUrl")}
          />
          <FieldError error={errors.photoUrl} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="portions">Portions</Label>
            <Input
              id="portions"
              type="number"
              placeholder="0"
              {...register("portions")}
            />
            <FieldError error={errors.portions} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="yieldWeight">Yield weight</Label>
            <Input
              id="yieldWeight"
              type="number"
              placeholder="0"
              {...register("yieldWeight")}
            />
            <FieldError error={errors.yieldWeight} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="salePrice">Sale price</Label>
            <Input
              id="salePrice"
              type="number"
              placeholder="0.00"
              {...register("salePrice")}
            />
            <FieldError error={errors.salePrice} />
          </div>
        </div>

        <div className="space-y-1 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm">
            Food cost percentage:{" "}
            <span className="font-medium">
              {liveFoodCostPercentage() !== null
                ? `${liveFoodCostPercentage().toFixed(1)}%`
                : "—"}
            </span>
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Update recipe"}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/recipes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
