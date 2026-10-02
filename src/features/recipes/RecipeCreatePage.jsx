import { useState, useEffect } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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

import { recipeSchema } from "./recipe.schema.js";
import { useCreateRecipe } from "./recipes.queries.js";
import { useProducts } from "../products/products.queries.js";
import { useCategories } from "../categories/categories.queries.js";
import { FieldError } from "@/components/FieldError.jsx";
import { InlineProductCreate } from "./InlineProductCreate.jsx";
import {
  computeFoodCost,
  computeTotalWeight,
  computeFoodCostPercentage,
  findProduct,
} from "./recipes.utils.js";

export function RecipeCreatePage() {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      ingredients: [],
    },
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });
  const navigate = useNavigate();
  const createMutation = useCreateRecipe();

  const { data: categoriesData, isLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts();

  const categories = categoriesData?.data ?? [];
  const products = productsData?.data.products ?? [];

  const watchedIngredients = watch("ingredients");
  const watchedSalePrice = watch("salePrice");
  const watchedPortionWeight = watch("portionWeight");

  const liveFoodCost = computeFoodCost(watchedIngredients, products);
  const totalWeight = computeTotalWeight(watchedIngredients, products);

  const foodCostPercentage = computeFoodCostPercentage(
    liveFoodCost,
    totalWeight,
    watchedPortionWeight,
    watchedSalePrice,
  );

  function onHandleSubmit(data) {
    createMutation.mutate(data, {
      onSuccess: () => navigate("/recipes"),
    });
  }

  useEffect(() => {
    if (!Number.isNaN(totalWeight)) {
      setValue("yieldWeight", totalWeight);
    }
  }, [totalWeight, setValue]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New recipe</h1>
        <p className="text-sm text-muted-foreground">
          Add a new recipe to your menu
        </p>
      </div>

      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-6">
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
          <div className="flex items-center justify-between gap-2">
            <Label>Ingredients</Label>
            <div className="flex shrink-0 gap-2">
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
            </div>
          </div>

          {isAddingProduct && (
            <InlineProductCreate
              onCreated={(newProduct) => {
                append({ productId: newProduct.id, quantity: "" });
                setIsAddingProduct(false);
              }}
              onCancel={() => setIsAddingProduct(false)}
            />
          )}

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No ingredients yet — click "Add ingredient" to start
            </p>
          )}

          {fields.map((item, index) => {
            const ingredientObj = watchedIngredients[index];
            const productId = ingredientObj?.productId;
            const product = findProduct(productId, products);
            const unit = product?.unit;
            return (
              <div key={item.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <Controller
                    name={`ingredients.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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

                        <FieldError
                          error={errors.ingredients?.[index]?.productId}
                        />
                      </>
                    )}
                  />
                </div>

                <div className="w-32 space-y-1">
                  <div className="relative">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Qty"
                      className={unit ? "pr-10" : undefined}
                      {...register(`ingredients.${index}.quantity`)}
                    />
                    {unit && (
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                        {unit}
                      </span>
                    )}
                  </div>
                  <FieldError error={errors.ingredients?.[index]?.quantity} />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>

        <div className="space-y-1 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm">
            Food cost:{" "}
            <span className="font-medium">{liveFoodCost.toFixed(2)}</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="yieldWeight">Yield weight (g)</Label>
          <Input
            id="yieldWeight"
            type="number"
            step="any"
            placeholder="Auto-calculated once every ingredient has a weight"
            {...register("yieldWeight")}
          />
          <FieldError error={errors.yieldWeight} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="portionWeight">Portion weight (g)</Label>
            <Input
              id="portionWeight"
              type="number"
              step="any"
              placeholder="0"
              {...register("portionWeight")}
            />
            <FieldError error={errors.portionWeight} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="salePrice">Price per portion</Label>
            <Input
              id="salePrice"
              type="number"
              step="any"
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
              {foodCostPercentage !== null
                ? `${foodCostPercentage.toFixed(1)}%`
                : "—"}
            </span>
          </p>
        </div>

        <div>
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
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={createMutation.isPending || isLoading || productsLoading}
          >
            {createMutation.isPending ? "Creating..." : "Create recipe"}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/recipes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
