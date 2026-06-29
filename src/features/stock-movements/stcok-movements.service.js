import apiClient from "@/lib/api";

export async function  getMovementsByProductId(productId){
  const res = await apiClient.get(`/stock/movements/${productId}/history`)
  return res.data
} 

export async function createStockMovements(data){
  const res = await apiClient.post(`/stock/movements/`, data)
  return res.data
}