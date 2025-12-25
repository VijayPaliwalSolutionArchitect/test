import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-rose-700 active:scale-[0.98]",
        outline:
          "border-2 border-purple-200 bg-white/80 backdrop-blur-sm hover:bg-purple-50 hover:border-purple-300 text-purple-700",
        secondary:
          "bg-white/80 backdrop-blur-sm text-gray-900 shadow-md hover:shadow-lg hover:bg-white border border-gray-200/50",
        ghost:
          "hover:bg-gray-100/80 hover:text-gray-900 text-gray-600",
        link:
          "text-purple-600 underline-offset-4 hover:underline",
        success:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700",
        warning:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
