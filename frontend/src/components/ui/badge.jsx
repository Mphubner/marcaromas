import React from "react";
import { cn } from "../../lib/utils";

/**
 * Componente Badge — usado para exibir selos de destaque,
 * status ou pequenas marcações visuais em cards e listas.
 */
export const Badge = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border border-transparent bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold transition-colors",
      "hover:bg-primary/90",
      className
    )}
    {...props}
  />
));

Badge.displayName = "Badge";
