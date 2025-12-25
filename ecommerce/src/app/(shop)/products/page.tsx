import { Suspense } from "react"
import { Metadata } from "next"
import { ProductGrid } from "./product-grid"
import { ProductFilters } from "./product-filters"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of products. Find electronics, fashion, home goods, and more at great prices.",
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-2">
          Discover our complete collection of amazing products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
