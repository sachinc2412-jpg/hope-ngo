"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Slide-over panel built on Radix Dialog — gives focus-trap, scroll-lock,
 * escape-to-close, and ARIA for free. Used for the mobile nav. Trimmed
 * shadcn-style Sheet; extend when other overlays need it.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="bg-ink/40 fixed inset-0 z-50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "bg-bg fixed inset-y-0 right-0 z-50 flex h-full w-4/5 max-w-sm flex-col p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close menu"
        className="text-ink-soft hover:text-ink focus-visible:outline-accent absolute top-5 right-5 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <X className="size-6" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
