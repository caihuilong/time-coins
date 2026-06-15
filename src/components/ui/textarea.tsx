import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-foreground outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
