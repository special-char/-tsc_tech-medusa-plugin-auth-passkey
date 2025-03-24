import * as React from "react"

import { cn } from "lib/utils"

type Props = {
  variant?: "custom" | "default"
  prefixIcon?: React.ReactNode
  postfixIcon?: React.ReactNode
} & React.ComponentProps<"input">

const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      type,
      prefixIcon,
      postfixIcon,
      variant = "default",
      ...props
    }: Props,
    ref
  ) => {
    return (
      <div className="w-full">
        <div className={cn("relative")}>
          {prefixIcon && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-primary h-max">
              {prefixIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-caption1",
              {
                [className || ""]: !!className,
                ["pl-8"]: !!prefixIcon,
                ["hover:border-black"]: variant === "custom",
              }
            )}
            ref={ref}
            {...props}
          />
          {postfixIcon && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary h-max">
              {postfixIcon}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
