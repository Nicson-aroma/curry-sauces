import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn("input input-bordered h-12 w-full min-w-0 text-sm", className)}
      {...props}
    />
  );
}

export { Input };
