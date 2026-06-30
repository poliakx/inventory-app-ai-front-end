import { Skeleton } from "./ui/skeleton"

export function TableSkeleton({ rows = 5 }) {
  return(
    <div>
      {Array.from({ length: rows}).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full mb-2 bg-gray-200"/>
      ))}
    </div>
  )
}