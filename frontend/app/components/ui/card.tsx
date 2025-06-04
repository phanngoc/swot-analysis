'use client';

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

// Create a variant style for different card moods
const cardVariants = cva(
  "relative rounded-lg border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-md hover:shadow-lg",
        insight: "bg-gradient-to-br from-blue-50 to-card text-card-foreground shadow-md hover:shadow-xl border-blue-100",
        analysis: "bg-gradient-to-br from-amber-50 to-card text-card-foreground shadow-md hover:shadow-xl border-amber-100",
        wisdom: "bg-gradient-to-br from-purple-50 to-card text-card-foreground shadow-md hover:shadow-xl border-purple-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Enhanced Card component with variants
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "insight" | "analysis" | "wisdom"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 relative", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight border-b pb-2 mb-1",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground italic", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 leading-relaxed", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0 pt-4 border-t border-muted/20", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
