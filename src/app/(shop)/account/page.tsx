import { Metadata } from "next"
import Link from "next/link"
import { User, Package, MapPin, Shield, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account",
}

const menuItems = [
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: Package,
    description: "View your order history",
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
    description: "Manage shipping and billing addresses",
  },
  {
    name: "Security",
    href: "/account/security",
    icon: Shield,
    description: "Password and security settings",
  },
]

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <item.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{item.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-600 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
