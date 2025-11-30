import React from 'react';
import { Button as BaseButton } from '../ui/button';
import { cn } from '@/lib/utils';

/**
 * Premium Button Component for Client Area
 * Variants: primary (brown), secondary, outline, ghost
 */
export function ClientButton({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    const variants = {
        primary: "bg-[#8B7355] hover:bg-[#7A6548] text-white shadow-lg hover:shadow-2xl",
        secondary: "bg-gray-100 hover:bg-gray-200 text-[#8B7355]",
        outline: "border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white",
        ghost: "text-[#8B7355] hover:bg-[#8B7355]/10",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-2xl"
    };

    return (
        <BaseButton
            className={cn(
                "rounded-2xl transition-all duration-300 hover:scale-105 font-semibold",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </BaseButton>
    );
}
