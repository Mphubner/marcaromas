import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

/**
 * Premium Page Header for Client Area
 * Includes: Back button, Title (Playfair), Subtitle, Optional action button
 */
export function ClientPageHeader({
    title,
    subtitle,
    backTo = '/dashboard',
    action
}) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Button
                variant="ghost"
                onClick={() => navigate(backTo)}
                className="mb-4 text-[#8B7355] hover:bg-[#8B7355]/10"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-2 font-['Playfair_Display']">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-gray-600 font-['Inter']">
                            {subtitle}
                        </p>
                    )}
                </div>

                {action && (
                    <div className="hidden md:block">
                        {action}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
