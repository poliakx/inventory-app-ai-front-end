import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryClient } from "@/lib/queryClient.js"
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from "./recipes.service.js"

export const useRecipes = (params) => {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => getRecipes(params),
  })
}

export const useRecipe = (id) => {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: () => getRecipeById(id),  
    enabled: !!id
  })
}

export const useCreate = () => {
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['recipes']})
      toast.success("Recipe created")
     }
  })
}

export const useUpdate = () => {
return useMutation({
  mutationFn: ({id, data}) => updateRecipe(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['recipes']})
    toast.success("Recipe updated")
  }
})
}

export const useDelete = () => {
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes']})
      toast.success("Recipe deleted")
    }
  })
} 