import { TableSkeleton } from "@/components/TableSkeleton.jsx";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCategories,
  useCreateCategories,
  useDeleteCategory,
} from "./categories.queries.js";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export function CategoryPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });
  const { data, isLoading } = useCategories();
  const categories = data?.data ?? [];

  const createMutation = useCreateCategories();

  function onSubmit(data) {
    createMutation.mutate(data);
    reset();
  }

  const deleteMutation = useDeleteCategory();

  if (isLoading) return <TableSkeleton rows={5} />;

  if (!categories) return null;

  if (categories.length === 0)
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            No categories yet. Create your first one.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <Input
              placeholder="Category name..."
              {...register("name")}
              className="w-64"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
            <Button type="submit">Add</Button>
          </form>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 max-w-sm">
        <Input placeholder="New category..." {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {" "}
          {createMutation.isPending ? "Creating..." : "Add"}
        </Button>
      </form>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(cat.id)}
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
    </div>
  );
}
