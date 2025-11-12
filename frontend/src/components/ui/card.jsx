import React from "react";
import { cn } from "../../lib/utils";

// Container principal do card
export const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  hover = true,
  ...props 
}, ref) => {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white border border-gray-100",
    gradient: "bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-none",
    outline: "border-2 border-brand-primary/20 bg-transparent",
    glass: "backdrop-blur-md bg-white/80 border border-white/20",
  };

  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02]" : "";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        "shadow-lg",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

// Cabeçalho do card
export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Título
export const CardTitle = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    default: "text-lg",
    sm: "text-base",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <h3
      ref={ref}
      className={cn(
        "font-bold font-display leading-tight tracking-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

// Corpo do card
export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";
