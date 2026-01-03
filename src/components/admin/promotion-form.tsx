"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Wand2, Copy, Calendar } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  sku: string
}

interface PromotionData {
  id?: string
  name: string
  code?: string | null
  type: string
  discountType: string
  discountValue: number
  maxDiscount?: number | null
  minPurchaseAmount?: number | null
  maxPurchaseAmount?: number | null
  applicableProductIds: string[]
  applicableCategoryIds: string[]
  excludedProductIds: string[]
  userSegments: string[]
  maxUsesPerUser?: number | null
  newCustomersOnly: boolean
  startDate: string
  endDate: string
  isActive: boolean
  maxTotalUses?: number | null
  displayName?: string | null
  description?: string | null
  bannerImage?: string | null
  badgeText?: string | null
  priority: number
  canStackWithOthers: boolean
}

interface PromotionFormProps {
  categories: Category[]
  products: Product[]
  initialData?: Partial<PromotionData>
}

export function PromotionForm({ categories, products, initialData }: PromotionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PromotionData>({
    name: initialData?.name || "",
    code: initialData?.code || "",
    type: initialData?.type || "PERCENTAGE",
    discountType: initialData?.discountType || "PERCENTAGE",
    discountValue: initialData?.discountValue || 0,
    maxDiscount: initialData?.maxDiscount || null,
    minPurchaseAmount: initialData?.minPurchaseAmount || null,
    maxPurchaseAmount: initialData?.maxPurchaseAmount || null,
    applicableProductIds: initialData?.applicableProductIds || [],
    applicableCategoryIds: initialData?.applicableCategoryIds || [],
    excludedProductIds: initialData?.excludedProductIds || [],
    userSegments: initialData?.userSegments || [],
    maxUsesPerUser: initialData?.maxUsesPerUser || null,
    newCustomersOnly: initialData?.newCustomersOnly ?? false,
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
    endDate: initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isActive: initialData?.isActive ?? true,
    maxTotalUses: initialData?.maxTotalUses || null,
    displayName: initialData?.displayName || "",
    description: initialData?.description || "",
    bannerImage: initialData?.bannerImage || "",
    badgeText: initialData?.badgeText || "",
    priority: initialData?.priority || 0,
    canStackWithOthers: initialData?.canStackWithOthers ?? false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : null) : value,
    }))
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

  const handleSwitchChange = (name: keyof PromotionData, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Coupon Code Generator
  const generateCouponCode = () => {
    const prefixes = ["SAVE", "DEAL", "OFF", "PROMO", "SALE"]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase()
    
    const code = `${prefix}${randomNum}${randomLetters}`
    setFormData((prev) => ({
      ...prev,
      code,
    }))
    toast.success("Coupon code generated!")
  }

  const copyCouponCode = () => {
    if (formData.code) {
      navigator.clipboard.writeText(formData.code)
      toast.success("Coupon code copied to clipboard!")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare the data
      const promotionData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        code: formData.code || null,
        maxDiscount: formData.maxDiscount || null,
        minPurchaseAmount: formData.minPurchaseAmount || null,
        maxPurchaseAmount: formData.maxPurchaseAmount || null,
        maxUsesPerUser: formData.maxUsesPerUser || null,
        maxTotalUses: formData.maxTotalUses || null,
        displayName: formData.displayName || null,
        description: formData.description || null,
        bannerImage: formData.bannerImage || null,
        badgeText: formData.badgeText || null,
      }

      const url = initialData?.id
        ? `/api/promotions/${initialData.id}`
        : "/api/promotions"
      const method = initialData?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionData),
      })

      if (!response.ok) {
        throw new Error("Failed to save promotion")
      }

      toast.success(
        initialData?.id ? "Promotion updated successfully" : "Promotion created successfully"
      )
      router.push("/admin/promotions")
      router.refresh()
    } catch (error) {
      console.error("Error saving promotion:", error)
      toast.error("Failed to save promotion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/promotions">
          <Button variant="ghost" type="button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Promotions
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : initialData?.id ? "Update Promotion" : "Create Promotion"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential promotion details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Promotion Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Summer Sale 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayName">Display Name (Optional)</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName || ""}
                  onChange={handleChange}
                  placeholder="Public-facing name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Brief description of the promotion"
                  rows={3}
                />
              </div>

              {/* Coupon Code Generator */}
              <div>
                <Label htmlFor="code">Coupon Code (Optional)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="code"
                    name="code"
                    value={formData.code || ""}
                    onChange={handleChange}
                    placeholder="Leave empty for auto-apply or generate one"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCouponCode}
                    title="Generate random coupon code"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  {formData.code && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyCouponCode}
                      title="Copy coupon code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for automatic application, or generate/enter a code for manual use
                </p>
              </div>

              <div>
                <Label htmlFor="badgeText">Badge Text (Optional)</Label>
                <Input
                  id="badgeText"
                  name="badgeText"
                  value={formData.badgeText || ""}
                  onChange={handleChange}
                  placeholder="e.g., SALE, NEW, HOT"
                />
              </div>

              <div>
                <Label htmlFor="bannerImage">Banner Image URL (Optional)</Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  value={formData.bannerImage || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Discount Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Configuration</CardTitle>
              <CardDescription>Set discount type and value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Promotion Type *</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleSelectChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="BOGO">Buy One Get One</option>
                    <option value="TIERED">Tiered</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleSelectChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountValue">
                    Discount Value * {formData.discountType === "PERCENTAGE" ? "(%)" : "($)"}
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={formData.discountType === "PERCENTAGE" ? "10" : "25"}
                    required
                  />
                </div>

                {formData.discountType === "PERCENTAGE" && (
                  <div>
                    <Label htmlFor="maxDiscount">Max Discount Amount ($)</Label>
                    <Input
                      id="maxDiscount"
                      name="maxDiscount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxDiscount || ""}
                      onChange={handleChange}
                      placeholder="100"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Conditions</CardTitle>
              <CardDescription>Set minimum and maximum purchase requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPurchaseAmount">Min Purchase Amount ($)</Label>
                  <Input
                    id="minPurchaseAmount"
                    name="minPurchaseAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minPurchaseAmount || ""}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>

                <div>
                  <Label htmlFor="maxPurchaseAmount">Max Purchase Amount ($)</Label>
                  <Input
                    id="maxPurchaseAmount"
                    name="maxPurchaseAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maxPurchaseAmount || ""}
                    onChange={handleChange}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Customers Only</Label>
                  <p className="text-sm text-gray-500">
                    Restrict to first-time customers
                  </p>
                </div>
                <Switch
                  checked={formData.newCustomersOnly}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("newCustomersOnly", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Set start and end dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-gray-500">
                    Enable this promotion
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Can Stack</Label>
                  <p className="text-sm text-gray-500">
                    Allow with other promos
                  </p>
                </div>
                <Switch
                  checked={formData.canStackWithOthers}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("canStackWithOthers", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={handleChange}
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Higher numbers = higher priority
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxTotalUses">Max Total Uses</Label>
                <Input
                  id="maxTotalUses"
                  name="maxTotalUses"
                  type="number"
                  min="0"
                  value={formData.maxTotalUses || ""}
                  onChange={handleChange}
                  placeholder="Unlimited"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Total times this promo can be used
                </p>
              </div>

              <div>
                <Label htmlFor="maxUsesPerUser">Max Uses Per User</Label>
                <Input
                  id="maxUsesPerUser"
                  name="maxUsesPerUser"
                  type="number"
                  min="0"
                  value={formData.maxUsesPerUser || ""}
                  onChange={handleChange}
                  placeholder="Unlimited"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Per-customer usage limit
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.code && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-sm">Coupon Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600">
                    {formData.code}
                  </Badge>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.discountType === "PERCENTAGE"
                      ? `${formData.discountValue}% OFF`
                      : `$${formData.discountValue} OFF`}
                  </p>
                  {formData.minPurchaseAmount && (
                    <p className="text-xs text-gray-600">
                      Min purchase: ${formData.minPurchaseAmount}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
