import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useProducts } from "../products/products.queries.js";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateStockMovement, useStockMovements } from "./stock-movements.queries.js";

export default function StockMovementsPage() {

  const [ selectedProductId, setSelectedProductId] = useState(null)
  const { register, control, handleSubmit, reset } = useForm()
  const { data: stockMovementsData, isLoading: stockMovementsLoading} = useStockMovements(selectedProductId)
  const { data: productsData, isLoading: productsLoading} = useProducts()

  const movements = stockMovementsData?.data??[]
  const products = productsData?.data.products??[]

  const createMutation = useCreateStockMovement()

  async function onSubmit(data){
     createMutation.mutate(data)
      reset()
  }

  return(
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Stock movements</h1>
        <p className="text-sm text-muted-foreground">Record incoming and outgoing stock</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-2">
        <Controller
          control={control}
          name="productId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="type"
          defaultValue="in"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">In</SelectItem>
                <SelectItem value="out">Out</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="h-9 w-28 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          {...register('quantity', {valueAsNumber: true})}
        />
        <Button type="submit">Add movement</Button>
      </form>

      <div className="space-y-3">
        <Select onValueChange={setSelectedProductId} value={selectedProductId ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select product to view history" />
          </SelectTrigger>
          <SelectContent>
            {products.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {productsLoading || stockMovementsLoading ? (
          <TableSkeleton rows={5} />
        ) : !selectedProductId ? null :  movements.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8">No movements recorded for this product</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(item => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 capitalize">{item.type}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
