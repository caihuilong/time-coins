import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base text-foreground outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
