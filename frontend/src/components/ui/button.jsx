// src/components/ui/button.jsx
import React from "react";

/**
 * Button component with variants and sizes.
 * Uses Tailwind classes and is accessible.
 */
export const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:from-brand-dark hover:to-brand-primary focus:ring-brand-primary/50 shadow-lg hover:shadow-xl transition-all duration-300",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500/50 shadow-lg hover:shadow-xl transition-all duration-300",
    outline: "border-2 border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary/10 focus:ring-brand-primary/40 transition-all duration-300",
    secondary: "bg-white text-brand-primary hover:bg-gray-50 focus:ring-brand-primary/40 shadow-md hover:shadow-lg transition-all duration-300",
    ghost: "bg-transparent hover:bg-brand-primary/10 text-brand-primary focus:ring-brand-primary/40 transition-all duration-300",
    link: "text-brand-primary underline-offset-4 hover:underline bg-transparent transition-all duration-300",
  };

  const sizeClasses = {
    default: "h-11 px-6 py-2 text-base",
    sm: "h-9 px-4 py-2 text-sm",
    lg: "h-14 px-8 py-3 text-lg",
    xl: "h-16 px-10 py-4 text-xl",
    icon: "h-11 w-11 p-0",
  };

  const appliedVariant = variantClasses[variant] || variantClasses.default;
  const appliedSize = sizeClasses[size] || sizeClasses.default;

  return (
    <button className={`${baseClasses} ${appliedVariant} ${appliedSize} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
