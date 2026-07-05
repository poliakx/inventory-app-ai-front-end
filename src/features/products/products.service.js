import apiClient from "@/lib/api";

export async function getProducts() {
  const res = await apiClient.get("/products")
  return res.data
};

export async function getProductsById(id) {
    const res = await apiClient.get(`/products/${id}`)
  return res.data
  
};

export async function updateProduct(id, data) {
  const res = await apiClient.put(`/products/${id}`, data)
  return res.data
};

export async function createProduct(data) {
  const res = await apiClient.post("/products", data)
  return res.data
}

export async function deleteProduct(id) {
  const res = await apiClient.delete(`/products/${id}`)
  return res.data
}