import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-lime-300 bg-lime-300 text-slate-950 hover:bg-lime-200",
        outline:
          "border-slate-700 bg-slate-950 text-white hover:border-lime-300/40 hover:bg-slate-900 dark:text-white",
        ghost: "border-transparent bg-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white dark:text-slate-200",
        secondary: "border-sky-900 bg-sky-950 text-sky-100 hover:bg-sky-900"
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
