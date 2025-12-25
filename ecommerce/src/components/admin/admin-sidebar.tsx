"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Tag,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  FileText,
  Image,
  Mail,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    badge: "1.2k",
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "12",
    badgeColor: "destructive" as const,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Promotions",
    href: "/admin/promotions",
    icon: Tag,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
]

const contentNav = [
  {
    name: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    name: "Popups & Modals",
    href: "/admin/modals",
    icon: Megaphone,
  },
]

const supportNav = [
  {
    name: "Messages",
    href: "/admin/messages",
    icon: Mail,
    badge: "5",
  },
  {
    name: "AI Chat",
    href: "/admin/ai-chat",
    icon: MessageSquare,
  },
  {
    name: "Alerts",
    href: "/admin/alerts",
    icon: Bell,
    badge: "3",
  },
]

const settingsNav = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href
    
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
          isActive
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
        {!collapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <Badge
                variant={item.badgeColor || "secondary"}
                className="text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <Store className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold gradient-text">SuperStore</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <div>
              {!collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </h3>
              )}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              {!collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Content
                </h3>
              )}
              <div className="space-y-1">
                {contentNav.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              {!collapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Support
                </h3>
              )}
              <div className="space-y-1">
                {supportNav.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Settings */}
            <div>
              <div className="space-y-1">
                {settingsNav.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full">
                <Store className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
