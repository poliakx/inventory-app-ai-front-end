import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getProducts, deleteProduct } from "./products.service.js"

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    }
  })
}
