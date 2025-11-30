import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex items-center w-full", className)}
    {...props}
  />
));
InputGroup.displayName = "InputGroup";

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn("pr-10 pl-10", className)} {...props} />
));
InputGroupInput.displayName = "InputGroupInput";

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "inline-start" | "inline-end";
  }
>(({ className, align = "inline-start", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-0 flex h-full items-center justify-center px-3 text-muted-foreground",
        align === "inline-start" ? "left-0" : "right-0",
        className
      )}
      {...props}
    />
  );
});
InputGroupAddon.displayName = "InputGroupAddon";

export { InputGroup, InputGroupInput, InputGroupAddon };
