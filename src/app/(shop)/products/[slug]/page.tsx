import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Star, Truck, Shield, RotateCcw, Heart, Share2, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ProductCard } from "@/components/product/product-card"
import { AddToCartButton } from "./add-to-cart-button"
import { formatPrice, calculateDiscount } from "@/lib/utils"

// Mock product data
const mockProduct = {
  id: "1",
  name: "Premium Wireless Headphones",
  slug: "premium-wireless-headphones",
  sku: "HDP-001",
  brand: "AudioMax",
  categoryId: "1",
  categoryPath: "Electronics / Audio / Headphones",
  price: 299.99,
  comparePrice: 399.99,
  currency: "USD",
  stockQuantity: 15,
  images: [
    { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", alt: "Headphones front", displayOrder: 0, isMain: true },
    { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", alt: "Headphones side", displayOrder: 1, isMain: false },
    { url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800", alt: "Headphones detail", displayOrder: 2, isMain: false },
    { url: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800", alt: "Headphones lifestyle", displayOrder: 3, isMain: false },
  ],
  shortDescription: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 40-hour battery life.",
  fullDescription: `<p>Immerse yourself in superior sound quality with the Premium Wireless Headphones by AudioMax. Engineered for audiophiles and casual listeners alike, these headphones deliver an unparalleled listening experience.</p>
  <h3>Key Features</h3>
  <ul>
    <li><strong>Active Noise Cancellation:</strong> Block out the world and focus on your music</li>
    <li><strong>40-Hour Battery Life:</strong> Long-lasting playback for extended listening sessions</li>
    <li><strong>Hi-Res Audio:</strong> Crystal-clear sound with deep bass and crisp highs</li>
    <li><strong>Comfortable Fit:</strong> Memory foam ear cushions for all-day comfort</li>
    <li><strong>Multi-Device Pairing:</strong> Seamlessly switch between devices</li>
  </ul>
  <p>Whether you're commuting, working, or relaxing at home, these headphones adapt to your lifestyle with customizable sound profiles through our companion app.</p>`,
  specifications: [
    {
      group: "Audio",
      specs: [
        { label: "Driver Size", value: "40mm" },
        { label: "Frequency Response", value: "20Hz - 20kHz" },
        { label: "Impedance", value: "32 Ohms" },
        { label: "Sensitivity", value: "110 dB" },
      ],
    },
    {
      group: "Connectivity",
      specs: [
        { label: "Bluetooth Version", value: "5.2" },
        { label: "Wireless Range", value: "10m" },
        { label: "Codecs", value: "AAC, aptX, LDAC" },
      ],
    },
    {
      group: "Battery",
      specs: [
        { label: "Battery Life (ANC On)", value: "40 hours" },
        { label: "Charging Time", value: "2 hours" },
        { label: "Quick Charge", value: "10 min = 3 hours" },
      ],
    },
    {
      group: "Physical",
      specs: [
        { label: "Weight", value: "250g" },
        { label: "Foldable", value: "Yes" },
        { label: "Colors", value: "Black, Silver, Midnight Blue" },
      ],
    },
  ],
  ratingAverage: 4.8,
  ratingCount: 256,
  status: "ACTIVE" as const,
  isFeatured: true,
  isVisible: true,
  freeShipping: true,
  tags: ["electronics", "audio", "wireless", "noise-cancelling"],
  hasVariants: true,
  variants: [
    { id: "v1", sku: "HDP-001-BLK", name: "Black", attributes: { color: "Black" }, price: 299.99, stockQuantity: 10, isAvailable: true },
    { id: "v2", sku: "HDP-001-SLV", name: "Silver", attributes: { color: "Silver" }, price: 299.99, stockQuantity: 5, isAvailable: true },
    { id: "v3", sku: "HDP-001-BLU", name: "Midnight Blue", attributes: { color: "Midnight Blue" }, price: 319.99, stockQuantity: 0, isAvailable: false },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const relatedProducts = [
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
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", alt: "Smart Watch", displayOrder: 0, isMain: true }],
    ratingAverage: 4.6,
    ratingCount: 189,
    status: "ACTIVE" as const,
    isFeatured: true,
    isVisible: true,
    freeShipping: true,
    tags: ["electronics"],
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const reviews = [
  {
    id: "r1",
    user: { displayName: "John D.", avatar: null },
    rating: 5,
    title: "Best headphones I've ever owned!",
    content: "The sound quality is incredible, and the noise cancellation is top-notch. Battery life is amazing - I only charge them once a week with daily use.",
    isVerifiedPurchase: true,
    helpfulCount: 45,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "r2",
    user: { displayName: "Sarah M.", avatar: null },
    rating: 5,
    title: "Perfect for work from home",
    content: "These headphones are a game-changer for my WFH setup. The ANC blocks out all distractions, and they're so comfortable I forget I'm wearing them.",
    isVerifiedPurchase: true,
    helpfulCount: 32,
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "r3",
    user: { displayName: "Mike R.", avatar: null },
    rating: 4,
    title: "Great sound, slightly tight fit",
    content: "Sound quality is excellent, but they feel a bit tight on my head after a few hours. The ear cushions are super soft though.",
    isVerifiedPurchase: true,
    helpfulCount: 18,
    createdAt: "2024-01-05T09:15:00Z",
  },
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In production, fetch product from database
  const product = mockProduct
  
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((img) => img.url),
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // In production, fetch from database
  // const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  const product = mockProduct
  
  if (!product) {
    notFound()
  }

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-purple-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-purple-600">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories/electronics" className="hover:text-purple-600">Electronics</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discount}% OFF
              </Badge>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                  index === 0 ? "border-purple-600" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            <Link href={`/brands/${product.brand.toLowerCase()}`} className="text-sm font-medium text-purple-600 hover:underline">
              {product.brand}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.ratingAverage)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 font-medium">{product.ratingAverage}</span>
            </div>
            <span className="text-gray-500">({product.ratingCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.comparePrice, product.currency)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="destructive">Save {discount}%</Badge>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600">{product.shortDescription}</p>

          {/* Variants */}
          {product.hasVariants && product.variants && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">Color</label>
                <div className="flex gap-3 mt-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      disabled={!variant.isAvailable}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        variant.id === "v1"
                          ? "border-purple-600 bg-purple-50"
                          : variant.isAvailable
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {variant.name}
                      {!variant.isAvailable && " (Out of Stock)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">2 Year Warranty</p>
                <p className="text-xs text-gray-500">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <RotateCcw className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">30-Day Returns</p>
                <p className="text-xs text-gray-500">Easy returns</p>
              </div>
            </div>
          </div>

          {/* SKU & Tags */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>SKU: {product.sku}</p>
            <div className="flex items-center gap-2">
              <span>Tags:</span>
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/products?tag=${tag}`}
                  className="text-purple-600 hover:underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mt-16">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600">
            Description
          </TabsTrigger>
          <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600">
            Reviews ({product.ratingCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-8">
          <div 
            className="prose prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: product.fullDescription || '' }}
          />
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            {product.specifications?.map((group) => (
              <Card key={group.group} className="p-6">
                <h3 className="font-semibold text-lg mb-4">{group.group}</h3>
                <dl className="space-y-3">
                  {group.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between">
                      <dt className="text-gray-500">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <Card className="p-6">
              <div className="text-center">
                <p className="text-5xl font-bold">{product.ratingAverage}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratingAverage)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-500">{product.ratingCount} reviews</p>
              </div>
              <Button className="w-full mt-6">Write a Review</Button>
            </Card>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {review.user.displayName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{review.user.displayName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold mt-4">{review.title}</h4>
                  <p className="text-gray-600 mt-2">{review.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <button className="text-gray-500 hover:text-gray-700">
                      Helpful ({review.helpfulCount})
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      Report
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
