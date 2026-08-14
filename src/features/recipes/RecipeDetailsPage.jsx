import { useParams } from "react-router-dom";
import { recipeSchema } from "./recipe.schema";
import { useRecipe, useUpdateRecipe } from "./recipes.queries.js";
import { useEffect } from "react";
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
  const categories = categoriesData?.data ?? [];

  const { data: productsData } = useProducts();
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
  if (!recipe) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.name}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      ></Controller>
      <FieldError error={errors.categoryId} />

      <Controller
        name="yieldUnit"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Yield unit"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="pcs">pcs</SelectItem>
            </SelectContent>
          </Select>
        )}
      ></Controller>
      <FieldError error={errors.yieldUnit} />
      {fields.length === 0 && (
        <p>No ingredients yet — click "Add ingredient" to start</p>
      )}

      <Button
        type="button"
        onClick={() => append({ productId: "", quantity: "" })}
      >
        Add ingredient
      </Button>

      {fields.map((item, index) => (
        <div key={item.id}>
          <Controller
            name={`ingredients.${index}.productId`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
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
          ></Controller>
          <FieldError error={errors.ingredients?.[index]?.productId} />
          <input type="number" {...register(`ingredients.${index}.quantity`)} />
          <FieldError error={errors.ingredients?.[index]?.quantity} />
          <Button type="button" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        <FieldError error={errors.name} />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Input id="instructions" {...register("instructions")} />
        <FieldError error={errors.instructions} />
      </div>

      <div>
        <Label htmlFor="photoUrl">Photo</Label>
        <Input id="photoUrl" {...register("photoUrl")} />
        <FieldError error={errors.photoUrl} />
      </div>

      <div>
        <Label htmlFor="portions">Portions</Label>
        <Input id="portions" type="number" {...register("portions")} />
        <FieldError error={errors.portions} />
      </div>

      <div>
        <Label htmlFor="yieldWeight">Yield weight</Label>
        <Input id="yieldWeight" type="number" {...register("yieldWeight")} />
        <FieldError error={errors.yieldWeight} />
      </div>

      <div>
        <Label htmlFor="salePrice">Sale price</Label>
        <Input id="salePrice" type="number" {...register("salePrice")} />
        <FieldError error={errors.salePrice} />
      </div>

      <div>
        <Label htmlFor="foodCost">Food cost: {liveFoodCost}</Label>
        <Label htmlFor="foodCostPercentage">
          Food cost percentage: {liveFoodCostPercentage()}
        </Label>
      </div>

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Updating..." : "Update recipe"}
      </Button>
    </form>
  );
}
