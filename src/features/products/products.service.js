import apiClient from "@/lib/api";

export async function getProducts() {
  const res = await apiClient.get("/products")
  return res
}