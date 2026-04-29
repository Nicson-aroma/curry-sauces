import { cn } from "../../lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("textarea textarea-bordered flex min-h-32 w-full text-sm", className)}
      {...props}
    />
  );
}

export { Textarea };
