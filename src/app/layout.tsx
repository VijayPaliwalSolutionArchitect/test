import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "SuperStore - World-Class E-Commerce",
    template: "%s | SuperStore",
  },
  description: "Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more with fast shipping and easy returns.",
  keywords: ["ecommerce", "online shopping", "electronics", "fashion", "deals"],
  authors: [{ name: "SuperStore" }],
  creator: "SuperStore",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SuperStore",
    title: "SuperStore - World-Class E-Commerce",
    description: "Discover amazing products at unbeatable prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperStore - World-Class E-Commerce",
    description: "Discover amazing products at unbeatable prices.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
