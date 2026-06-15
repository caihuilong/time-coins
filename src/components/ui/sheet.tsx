"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/25 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-t-[2rem] bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl outline-none",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mb-5 h-1.5 w-11 rounded-full bg-stone-300" />
        {children}
        <Dialog.Close className="absolute right-4 top-4 rounded-full p-2 text-stone-500 hover:bg-white">
          <X className="h-5 w-5" />
          <span className="sr-only">关闭</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
