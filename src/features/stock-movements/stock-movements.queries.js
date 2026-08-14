import { useMutation, useQuery } from "@tanstack/react-query";
import { createStockMovements, getMovementsByProductId } from "./stock-movements.service.js";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export const useCreateStockMovement = () => {
  return useMutation({
    mutationFn: createStockMovements,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['stockMovements']})
      toast.success('Stock movement recorded')
    }
  })
}

export const useStockMovements = (productId) => {
  return useQuery({
    enabled: !!productId,
    queryKey: ['stockMovements', productId],
    queryFn: ()=> getMovementsByProductId(productId)
  })
}