import { useProducts } from "../products/products.queries.js";
import { useCategories } from "../categories/categories.queries.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";

export function DashboardPage() {
  const {data: productData, isLoading: productLoading} = useProducts()
  const {data: categoriesData, isLoading: categoriesLoading} = useCategories()

  const products = productData?.data.products ?? [] 
  const categories = categoriesData?.data ?? [] 

  const lowStock = products.filter(p => p.quantity < 10)

  if (productLoading || categoriesLoading) return <TableSkeleton rows={3} />

  const stats = [
    { label: 'Total products', value: products.length },
    { label: 'Categories', value: categories.length },
    { label: 'Low stock', value: lowStock.length },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Low stock</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-destructive font-medium">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
