import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-primary",
        outline: "btn-outline",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        destructive: "btn-error",
        link: "btn-link no-underline hover:underline",
      },
      size: {
        default: "btn-md",
        xs: "btn-xs",
        sm: "btn-sm",
        lg: "btn-lg",
        icon: "btn-square btn-md",
        "icon-xs": "btn-square btn-xs",
        "icon-sm": "btn-square btn-sm",
        "icon-lg": "btn-square btn-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, ...props }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
