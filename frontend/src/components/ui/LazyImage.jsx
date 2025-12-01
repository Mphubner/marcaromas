import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function LazyImage({ src, alt, className, imageClassName, aspectRatio = "aspect-square", ...props }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn("relative overflow-hidden bg-gray-100", aspectRatio, className)}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className={cn(
                    "w-full h-full object-cover transition-all duration-700 ease-in-out",
                    isLoaded ? "opacity-100 blur-0" : "opacity-0 scale-110 blur-xl",
                    imageClassName
                )}
                onLoad={() => setIsLoaded(true)}
                {...props}
            />
        </div>
    );
}
