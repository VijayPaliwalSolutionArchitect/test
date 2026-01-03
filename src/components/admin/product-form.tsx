"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X, Upload, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductImage {
  url: string
  alt?: string
  isPrimary?: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  barcode?: string | null
  brand: string
  categoryId: string
  price: number
  comparePrice?: number | null
  costPrice?: number | null
  stockQuantity: number
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorder: boolean
  shortDescription?: string | null
  fullDescription?: string | null
  status: string
  isFeatured: boolean
  freeShipping: boolean
  tags: string[]
  images: ProductImage[]
}

interface ProductFormProps {
  categories: Category[]
  initialData?: Partial<Product>
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    brand: initialData?.brand || "",
    categoryId: initialData?.categoryId || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    costPrice: initialData?.costPrice || "",
    stockQuantity: initialData?.stockQuantity || "",
    lowStockThreshold: initialData?.lowStockThreshold || "10",
    trackInventory: initialData?.trackInventory ?? true,
    allowBackorder: initialData?.allowBackorder ?? false,
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    status: initialData?.status || "DRAFT",
    isFeatured: initialData?.isFeatured ?? false,
    freeShipping: initialData?.freeShipping ?? false,
    tags: initialData?.tags?.join(", ") || "",
  })
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || []
  )
  const [imageUrl, setImageUrl] = useState("")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from name
    if (name === "name" && !initialData) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }))
    }

    // Auto-generate SKU from brand and name
    if ((name === "name" || name === "brand") && !initialData) {
      const brand = name === "brand" ? value : formData.brand
      const productName = name === "name" ? value : formData.name
      if (brand && productName) {
        const sku = `${brand.substring(0, 3).toUpperCase()}-${productName
          .substring(0, 6)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        setFormData((prev) => ({
          ...prev,
          sku,
        }))
      }
    }
  }

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t)

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        tags: tagsArray,
        images: images.map((url, index) => ({
          url,
          alt: formData.name,
          isPrimary: index === 0,
        })),
      }

      const url = initialData
        ? `/api/products/${initialData.slug}`
        : "/api/products"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      toast.success(initialData ? "Product updated successfully" : "Product created successfully")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/products">
          <Button variant="ghost" type="button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="wireless-bluetooth-headphones"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="WBH-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="123456789012"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Sony, Apple, Samsung"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="A brief product description (1-2 sentences)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Detailed product description, features, specifications..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="wireless, bluetooth, audio, headphones"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set product pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="99.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    placeholder="129.99"
                  />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="50.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage stock levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Track Inventory</Label>
                  <p className="text-sm text-gray-500">
                    Enable stock tracking for this product
                  </p>
                </div>
                <Switch
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("trackInventory", checked)
                  }
                />
              </div>

              {formData.trackInventory && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        name="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        placeholder="100"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        name="lowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Backorder</Label>
                      <p className="text-sm text-gray-500">
                        Allow customers to order when out of stock
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowBackorder}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("allowBackorder", checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Add product photos (first image will be primary)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddImage()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddImage} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 text-xs">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No images added yet</p>
                  <p className="text-sm text-gray-400">Add image URLs to display product photos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Product Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Featured Product</Label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Free Shipping</Label>
                <Switch
                  checked={formData.freeShipping}
                  onCheckedChange={(checked) => handleSwitchChange("freeShipping", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleSelectChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
