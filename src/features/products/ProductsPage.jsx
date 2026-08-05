import { useState } from "react";
import { useProducts, useDeleteProduct } from "./products.queries.js";

import { Link } from "react-router-dom";
import { TableSkeleton } from "@/components/TableSkeleton.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProducts();

  const products = data?.data.products ?? [];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteMutation = useDeleteProduct();
  if (isLoading) return <TableSkeleton rows={5} />;

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted-foreground mb-4">No products yet</p>
        <Button asChild>
          <Link to="/products/new">Create first product</Link>
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Button asChild>
          <Link to="/products/new">New product</Link>
        </Button>
      </div>
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      {filteredProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8">
          No products found for "{search}"
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.price}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
