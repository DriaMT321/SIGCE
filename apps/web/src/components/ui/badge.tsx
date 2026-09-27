import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-slate-200 bg-slate-900 text-white shadow-2xs",
        secondary:
          "border border-slate-200/80 bg-slate-100 text-slate-700",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
        brand:
          "border border-brand-200 bg-brand-50 text-brand-800",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-800",
        danger:
          "border border-red-200 bg-red-50 text-red-800",
        info:
          "border border-blue-200 bg-blue-50 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
