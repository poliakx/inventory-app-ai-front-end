import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { recipeSchema } from "./recipe.schema.js";
import { useCreateRecipe } from "./recipes.queries.js";
import { useProducts } from "../products/products.queries.js";
import { useCategories } from "../categories/categories.queries.js";



export function RecipeCreatePage() {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(recipeSchema)
  })
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" })
  const navigate = useNavigate()
  const createMutation = useCreateRecipe()

  const { data: categoriesData, isLoading} = useCategories()
  const { data: productsData, isLoading: productsLoading } = useProducts()

  const categories = categoriesData?.data??[] 
  const products = productsData?.data.products??[]

  function onHandleSubmit(data) {
    createMutation.mutate(data, {
      onSuccess: () => navigate("/recipes")
    })
  }

  return (
    <form onSubmit = {handleSubmit(onHandleSubmit)}>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select onValueChange = {field.onChange} value = {field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(k =>(
                <SelectItem key={k.id} value={k.id}>{k.name} </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      >
      </Controller>
    </form>
  )
}