import apiClient from "../../lib/api.js"

export async function getCategories() {
  const res = await apiClient.get("/categories")
  return res.data
}

export async function createCategories(data) {
  const res = await apiClient.post("/categories", data)
  return res.data
}

export async function deleteCategories(id) {
  const res = await apiClient.delete(`/categories/${id}`) 
  return res.data
}