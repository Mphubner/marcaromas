import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Premium Tabs Component for Client Area
 * Horizontal tabs with animated indicator
 */
export function ClientTabs({ tabs, defaultTab = 0, className }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div className={cn("w-full", className)}>
            {/* Tab Headers */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === index;

                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={cn(
                                    "flex items-center gap-2 px-1 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                                    isActive
                                        ? "border-[#8B7355] text-[#8B7355]"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                {Icon && <Icon className="w-5 h-5" />}
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="relative">
                {tabs.map((tab, index) => (
                    <motion.div
                        key={index}
                        initial={false}
                        animate={{
                            opacity: activeTab === index ? 1 : 0,
                            y: activeTab === index ? 0 : 10,
                            display: activeTab === index ? 'block' : 'none'
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {tab.content}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
