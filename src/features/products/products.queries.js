import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryClient } from "@/lib/queryClient.js"
import { getProducts, deleteProduct, createProduct, updateProduct, getProductsById } from "./products.service.js"


export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductsById(id),
    enabled: !!id
  })
}

export function useCreateProducts() {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      queryClient.setQueryData(['products'], (old) => {
        if(!old) return old;
        return {
          ...old, 
          data: {
            ...old.data,
            products: [...old.data.products, response.data],
          },
        };
      })
      toast.success('Product created')
    }
  })
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({id, data}) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']})
      toast.success('Product updated')
    }
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    }
  })
}
