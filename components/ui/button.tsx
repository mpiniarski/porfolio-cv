"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { ButtonVariantProps } from "./button-variants"
import { buttonVariants } from "./button-variants"

import { cn } from "@/lib/utils"

type ButtonProps = ButtonPrimitive.Props &
  ButtonVariantProps & {
    asChild?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
