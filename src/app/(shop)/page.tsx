import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Truck, Shield, CreditCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product/product-card"
import prisma from "@/lib/prisma"

// Mock data for demo - in production, this comes from database
const mockFeaturedProducts = [
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
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", alt: "Headphones side", displayOrder: 1, isMain: false },
    ],
    shortDescription: "Experience crystal-clear audio with our premium wireless headphones.",
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
    shortDescription: "Stay connected with the most advanced smartwatch.",
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
    shortDescription: "Sleek and functional leather backpack for everyday use.",
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
    shortDescription: "Comfortable and sustainable organic cotton t-shirt.",
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
]

const categories = [
  { name: "Electronics", slug: "electronics", icon: "💻", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", count: 1250 },
  { name: "Fashion", slug: "fashion", icon: "👗", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", count: 3420 },
  { name: "Home & Garden", slug: "home-garden", icon: "🏠", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400", count: 890 },
  { name: "Sports", slug: "sports", icon: "⚽", image: "https://images.unsplash.com/photo-1461896836934- voices?w=400", count: 675 },
  { name: "Beauty", slug: "beauty", icon: "💄", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", count: 1120 },
  { name: "Toys & Games", slug: "toys", icon: "🧸", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400", count: 450 },
]

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", description: "100% protected" },
  { icon: CreditCard, title: "Easy Returns", description: "30-day policy" },
  { icon: Sparkles, title: "AI Assistant", description: "24/7 support" },
]

export default async function HomePage() {
  // In production, fetch from database:
  // const featuredProducts = await prisma.product.findMany({
  //   where: { isFeatured: true, isVisible: true, status: 'ACTIVE' },
  //   take: 8,
  // })
  
  const featuredProducts = mockFeaturedProducts

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                ✨ New Season Collection
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Explore our curated collection of premium products. From electronics to fashion,
                find everything you need with AI-powered recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/categories">
                    Browse Categories
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-white/60 text-sm">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-white/60 text-sm">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-white/60 text-sm">Rating</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl" />
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
                  alt="Shopping"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-2">Browse our wide selection of categories</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <span className="text-2xl mb-1 block">{category.icon}</span>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-xs text-white/70">{category.count} products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <Badge className="mb-2">Featured</Badge>
              <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
              <p className="text-gray-500 mt-2">Discover our most popular items</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800')] bg-cover bg-center" />
            </div>
            <div className="relative z-10 max-w-lg">
              <Badge className="bg-white/20 text-white border-0 mb-4">
                Limited Time Offer
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get 20% Off Your First Order
              </h2>
              <p className="text-white/80 mb-6">
                Sign up today and receive an exclusive discount on your first purchase.
                Plus, get access to member-only deals and early access to new arrivals.
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Real reviews from real customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah J.",
                rating: 5,
                text: "Absolutely love shopping here! The AI assistant helped me find exactly what I needed. Fast shipping too!",
                avatar: "SJ",
              },
              {
                name: "Michael R.",
                rating: 5,
                text: "Best online shopping experience I've had. The product quality exceeded my expectations.",
                avatar: "MR",
              },
              {
                name: "Emily T.",
                rating: 5,
                text: "The return process was so easy! Customer service is top-notch. Will definitely shop here again.",
                avatar: "ET",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <span className="font-medium">{testimonial.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-500 mb-8">
              Subscribe to our newsletter for exclusive deals, new arrivals, and style tips
              delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
