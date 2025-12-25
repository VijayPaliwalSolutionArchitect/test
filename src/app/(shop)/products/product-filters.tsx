"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "electronics", name: "Electronics", count: 1250 },
  { id: "fashion", name: "Fashion", count: 3420 },
  { id: "home-garden", name: "Home & Garden", count: 890 },
  { id: "sports", name: "Sports", count: 675 },
  { id: "beauty", name: "Beauty", count: 1120 },
  { id: "toys", name: "Toys & Games", count: 450 },
]

const brands = [
  { id: "apple", name: "Apple", count: 234 },
  { id: "samsung", name: "Samsung", count: 189 },
  { id: "nike", name: "Nike", count: 456 },
  { id: "adidas", name: "Adidas", count: 321 },
  { id: "sony", name: "Sony", count: 156 },
  { id: "lg", name: "LG", count: 98 },
]

const ratings = [5, 4, 3, 2, 1]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [inStock, setInStock] = useState(false)
  const [freeShipping, setFreeShipping] = useState(false)

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedRating ? 1 : 0) +
    (inStock ? 1 : 0) +
    (freeShipping ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedRating(null)
    setInStock(false)
    setFreeShipping(false)
    setPriceRange([0, 1000])
    router.push("/products")
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedCategories.length) {
      params.set("categories", selectedCategories.join(","))
    }
    if (selectedBrands.length) {
      params.set("brands", selectedBrands.join(","))
    }
    if (selectedRating) {
      params.set("rating", selectedRating.toString())
    }
    if (inStock) {
      params.set("inStock", "true")
    }
    if (freeShipping) {
      params.set("freeShipping", "true")
    }
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }
    
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "brands"]}>
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category.id)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-400">({category.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                step={10}
                className="mt-2"
              />
              <div className="flex items-center justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand.id])
                        } else {
                          setSelectedBrands(
                            selectedBrands.filter((b) => b !== brand.id)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`brand-${brand.id}`} className="cursor-pointer">
                      {brand.name}
                    </Label>
                  </div>
                  <span className="text-xs text-gray-400">({brand.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                    selectedRating === rating
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < rating ? "text-yellow-400" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm">& up</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Other Filters */}
        <AccordionItem value="other">
          <AccordionTrigger>Other</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="in-stock"
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(!!checked)}
                />
                <Label htmlFor="in-stock" className="cursor-pointer">
                  In Stock Only
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="free-shipping"
                  checked={freeShipping}
                  onCheckedChange={(checked) => setFreeShipping(!!checked)}
                />
                <Label htmlFor="free-shipping" className="cursor-pointer">
                  Free Shipping
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-6" onClick={applyFilters}>
        Apply Filters
      </Button>
    </Card>
  )
}
