import apiClient from "./api";

export async function getProducts() {
  const res = await apiClient.get("/products")
  return res
}