import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

import { recipeSchema } from "./recipe.schema.js";
import { useCreateRecipe } from "./recipes.queries.js";
import { useProducts } from "../products/products.queries.js";
import { useCategories } from "../categories/categories.queries.js";



export function RecipeCreatePage() {
  const { handleSubmit, control, register, formState: { errors } } = useForm({
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

      <Controller 
        name="yieldUnit"
        control={control}
        render={({field}) => (
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
      >
        
      </Controller>

      
      <Button type="button" onClick={() => append({ productId: "", quantity: "" })}>
        Add ingredient
      </Button>

      
      {fields.map((item, index) => (
        <div key={item.id}>
          <Controller
      name={`ingredients.${index}.productId`}
      control={control}
      render={({field}) => (
        <Select onValueChange = {field.onChange} value = {field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select product"/>
          </SelectTrigger>
          <SelectContent>
            {products.map(p =>(
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
          ))}
          </SelectContent>
        </Select>
      )}
      >
      </Controller>
      <input type="number" {...register(`ingredients.${index}.quantity`)}/>
      <Button type="button" onClick={() => remove(index)}>Remove</Button>
        </div>
      ))}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")}/>
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Input id="instructions" {...register("instructions")}/>
        {errors.instructions && <p>{errors.instructions.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="photoUrl">Photo</Label>
        <Input id="photoUrl" {...register("photoUrl")}/>
        {errors.photoUrl && <p>{errors.photoUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="portions" >Portions</Label>
        <Input id="portions" type="number" {...register("portions")}/>
        {errors.portions && <p>{errors.portions.message}</p>}
      </div>

      <div>
        <Label htmlFor="yieldWeight">Yield weight</Label>
        <Input id="yieldWeight" type="number" {...register("yieldWeight")}/>
        {errors.yieldWeight && <p>{errors.yieldWeight.message}</p>}
      </div>

      <div>
        <Label htmlFor="salePrice" >Sale price</Label>
        <Input id="salePrice" type="number" {...register("salePrice")}/>
        {errors.salePrice && <p>{errors.salePrice.message}</p>}
      </div>



      <Button type="submit">Create recipe</Button>
      
    </form>
  )
}