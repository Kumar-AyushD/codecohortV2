import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  (
    { 
      className, 
      orientation = "horizontal", 
      decorative = true, 
      ...props 
    },
    ref
  ) => (
    <hr
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "bg-border shrink-0 mx-auto", // Added mx-auto to center
        orientation === "horizontal"
          ? "h-[1px] w-1/4" // Reduced width to 3/4 of container
          : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)

Separator.displayName = "Separator"