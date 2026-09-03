import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Premium button. Three variants, one rule: only ONE primary per view.
 * `asChild` renders the styles onto a child (e.g. a Next <Link>) instead of a
 * <button>, so button-styled links stay semantic. shadcn-style API.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-sans text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-ink hover:bg-accent-hover",
        secondary: "border border-line text-ink hover:bg-bg-raised",
        ghost: "text-ink hover:bg-bg-raised",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
