import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { getCategories, deleteCategories, createCategories } from "./categories.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ['/categories'],
    queryFn: getCategories
  })
}

export const useCreateCategories = () => {
  return useMutation({
    mutationFn: createCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['/categories']})
      toast.success('Category created')
    }
  })
}

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['/categories']})
      toast.success('Category deleted')
    }
  })
}