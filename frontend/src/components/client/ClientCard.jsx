import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Premium Card Component for Client Area
 * Enhanced shadows, rounded corners, hover effects
 */
export function ClientCard({
    children,
    title,
    description,
    icon: Icon,
    className,
    gradient = false,
    hoverable = true,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
        >
            <Card
                className={cn(
                    "rounded-2xl border-gray-200 shadow-lg",
                    hoverable && "hover:shadow-2xl transition-all duration-300",
                    gradient && "bg-gradient-to-br from-[#8B7355] to-[#7A6548] text-white border-none",
                    className
                )}
                {...props}
            >
                {(title || description) && (
                    <CardHeader>
                        {title && (
                            <CardTitle className={cn(
                                "flex items-center gap-3 text-xl font-semibold",
                                gradient ? "text-white" : "text-[#2C2419]"
                            )}>
                                {Icon && <Icon className="w-5 h-5" />}
                                {title}
                            </CardTitle>
                        )}
                        {description && (
                            <CardDescription className={gradient ? "text-white/80" : ""}>
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                )}
                <CardContent className="space-y-4">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
}
