import apiClient from "@/lib/api";

export async function getProducts() {
  const res = await apiClient.get("/products")
  return res.data
}

export async function getProductsById(id) {
    const res = await apiClient.get(`/products/${id}`)
  return res.data
}