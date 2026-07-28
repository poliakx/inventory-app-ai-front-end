import apiClient from "@/lib/api.js"

export const getRecipes = async(params) => {
  const res = await apiClient.get("/recipes", {params})
  return res.data
}

export const createRecipe = async(data) => {
  const res = await apiClient.post("/recipes", data)
  return res.data
}

export const getRecipeById = async(id) => {
  const res = await apiClient.get(`/recipes/${id}`)
  return res.data
}

export const updateRecipe = async(id, data) => {
  const res = await apiClient.put(`/recipes/${id}`, data)
  return res.data
}

export const deleteRecipe = async(id) => {
  const res = await apiClient.delete(`/recipes/${id}`)
  return res.data
}