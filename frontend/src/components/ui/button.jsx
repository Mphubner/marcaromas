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
    default: "bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-brand-primary/50",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/40",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300/40",
    secondary: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800/40",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-gray-200/40",
    link: "text-brand-primary underline-offset-4 hover:underline bg-transparent",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10 p-0",
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
