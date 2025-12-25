import { ProductCard } from "@/components/product/product-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid3X3, LayoutList } from "lucide-react"

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    sku: "HDP-001",
    brand: "AudioMax",
    categoryId: "1",
    price: 299.99,
    comparePrice: 399.99,
    currency: "USD",
    stockQuantity: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", alt: "Headphones", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.8,
    ratingCount: 256,
    status: "ACTIVE" as const,
    isFeatured: true,
    isVisible: true,
    freeShipping: true,
    tags: ["electronics", "audio"],
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    sku: "SWP-002",
    brand: "TechWear",
    categoryId: "1",
    price: 449.99,
    comparePrice: 549.99,
    currency: "USD",
    stockQuantity: 8,
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", alt: "Smart Watch", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.6,
    ratingCount: 189,
    status: "ACTIVE" as const,
    isFeatured: true,
    isVisible: true,
    freeShipping: true,
    tags: ["electronics", "wearables"],
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    sku: "BKP-003",
    brand: "UrbanCarry",
    categoryId: "2",
    price: 189.99,
    currency: "USD",
    stockQuantity: 25,
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", alt: "Backpack", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.9,
    ratingCount: 342,
    status: "ACTIVE" as const,
    isFeatured: true,
    isVisible: true,
    freeShipping: false,
    tags: ["fashion", "accessories"],
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    sku: "TSH-004",
    brand: "EcoWear",
    categoryId: "2",
    price: 39.99,
    comparePrice: 59.99,
    currency: "USD",
    stockQuantity: 100,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", alt: "T-Shirt", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.5,
    ratingCount: 128,
    status: "ACTIVE" as const,
    isFeatured: false,
    isVisible: true,
    freeShipping: true,
    tags: ["fashion", "sustainable"],
    hasVariants: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Professional Camera Lens",
    slug: "professional-camera-lens",
    sku: "CAM-005",
    brand: "PhotoPro",
    categoryId: "1",
    price: 899.99,
    currency: "USD",
    stockQuantity: 5,
    images: [
      { url: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500", alt: "Camera Lens", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.9,
    ratingCount: 89,
    status: "ACTIVE" as const,
    isFeatured: false,
    isVisible: true,
    freeShipping: true,
    tags: ["electronics", "photography"],
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Running Shoes Elite",
    slug: "running-shoes-elite",
    sku: "SHO-006",
    brand: "SportMax",
    categoryId: "3",
    price: 159.99,
    comparePrice: 199.99,
    currency: "USD",
    stockQuantity: 45,
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", alt: "Running Shoes", displayOrder: 0, isMain: true },
    ],
    ratingAverage: 4.7,
    ratingCount: 567,
    status: "ACTIVE" as const,
    isFeatured: true,
    isVisible: true,
    freeShipping: false,
    tags: ["sports", "footwear"],
    hasVariants: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

interface ProductGridProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  // In production, fetch products from database with filters
  // const products = await prisma.product.findMany({ ... })
  
  const products = mockProducts
  const totalProducts = products.length

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{totalProducts}</span> products
        </p>
        
        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select defaultValue="popular">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button variant="ghost" size="icon" className="rounded-none border-r">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-none">
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button size="sm" className="w-10">
            1
          </Button>
          <Button variant="outline" size="sm" className="w-10">
            2
          </Button>
          <Button variant="outline" size="sm" className="w-10">
            3
          </Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="sm" className="w-10">
            12
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
