import { useState } from "react";
import { useDeleteRecipe, useRecipes } from "./recipes.queries.js";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/TableSkeleton.jsx";

export function RecipesPage() {
  const [page, setPage] = useState();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useRecipes();
  const recipes = data?.data.recipes ?? [];

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );
  const deleteMutation = useDeleteRecipe();

  if (isLoading) return <TableSkeleton rows={5} />;

  if (recipes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted-foreground mb-4">No recipes yet</p>
        <Button asChild>
          <Link to="/recipes/new">Create first recipe</Link>
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
        <Button asChild>
          <Link to="/recipes/new">New recipe</Link>
        </Button>
      </div>
      <Input
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      {filteredRecipes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8">
          No recipes found for "{search}"
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
                  Portions
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Food cost
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Food cost %
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sale price
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="font-medium hover:underline"
                    >
                      {recipe.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipe.portions}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipe.foodCost}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipe.foodCostPercentage}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipe.salePrice}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(recipe.id)}
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
