import { cn } from "../../lib/utils";

function Card({ className, size = "default", ...props }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "card border border-base-300 bg-base-100 text-base-content shadow-xl",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("card-body grid gap-2 pb-0", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("card-title text-base leading-tight font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-6 text-base-content/70", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return <div data-slot="card-action" className={cn("self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("card-body pt-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("card-body flex items-center border-t border-base-300 bg-base-200", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
