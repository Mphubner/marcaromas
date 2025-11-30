import React from 'react';
import { motion } from 'framer-motion';
import { ClientButton } from './ClientButton';

/**
 * Premium Empty State Component
 * Shows when there's no data with icon, message, and CTA
 */
export function ClientEmptyState({
    icon: Icon,
    title,
    message,
    actionLabel,
    onAction,
    illustration
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {/* Icon or Illustration */}
            {illustration ? (
                <img src={illustration} alt={title} className="w-64 h-64 object-contain mb-8 opacity-80" />
            ) : Icon ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B7355]/10 to-[#7A6548]/10 flex items-center justify-center mb-8">
                    <Icon className="w-12 h-12 text-[#8B7355]" />
                </div>
            ) : null}

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#2C2419] mb-3 font-['Playfair_Display']">
                {title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-8 max-w-md">
                {message}
            </p>

            {/* Action Button */}
            {actionLabel && onAction && (
                <ClientButton onClick={onAction}>
                    {actionLabel}
                </ClientButton>
            )}
        </motion.div>
    );
}
