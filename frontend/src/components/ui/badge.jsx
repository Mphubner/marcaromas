import React from "react";
import { cn } from "../../lib/utils";

/**
 * Componente Badge — usado para exibir selos de destaque,
 * status ou pequenas marcações visuais em cards e listas.
 */
export const Badge = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-300";

  const variantClasses = {
    default: "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm",
    outline: "border border-brand-primary/30 text-brand-primary hover:border-brand-primary/50",
    "outline-white": "border border-white/30 text-white backdrop-blur-sm hover:border-white/50",
  };

  const appliedVariant = variantClasses[variant] || variantClasses.default;

  return (
    <span 
      ref={ref} 
      className={cn(baseClasses, appliedVariant, className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
