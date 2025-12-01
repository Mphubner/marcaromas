import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Award } from 'lucide-react';
import { ClientCard, ClientBadge } from '@/components/client';
import { cn } from '@/lib/utils';

/**
 * Achievement Card Component
 * Displays achievement with tier badge, progress, and unlock status
 */
export function AchievementCard({ achievement, index = 0 }) {
    const { id, name, description, icon, category, tier, points, progress = 0, total = 1, unlocked = false, unlockedAt } = achievement;

    const progressPercentage = (progress / total) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
        >
            <ClientCard hoverable={unlocked} className={cn(
                "relative overflow-hidden",
                !unlocked && "opacity-75"
            )}>
                {/* Unlocked Badge */}
                {unlocked && (
                    <div className="absolute top-4 right-4">
                        <ClientBadge variant="success">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Desbloqueado
                        </ClientBadge>
                    </div>
                )}

                {/* Tier Badge */}
                <div className="absolute top-4 left-4">
                    <ClientBadge variant={tier.toLowerCase()}>
                        {tier}
                    </ClientBadge>
                </div>

                {/* Achievement Icon */}
                <div className="text-center mb-4 mt-8">
                    <div className={cn(
                        "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 transition-all duration-300",
                        unlocked
                            ? "bg-gradient-to-br from-[#8B7355] to-[#7A6548] shadow-lg"
                            : "bg-gray-200 grayscale"
                    )}>
                        {unlocked ? icon : <Lock className="w-8 h-8 text-gray-400" />}
                    </div>

                    <h3 className={cn(
                        "font-bold text-xl mb-2",
                        unlocked ? "text-[#2C2419]" : "text-gray-400"
                    )}>
                        {name}
                    </h3>

                    <p className={cn(
                        "text-sm px-4",
                        unlocked ? "text-gray-600" : "text-gray-400"
                    )}>
                        {description}
                    </p>
                </div>

                {/* Progress Bar */}
                {!unlocked && (
                    <div className="mb-4 px-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progresso</span>
                            <span>{progress}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-[#8B7355] to-[#7A6548] rounded-full"
                            />
                        </div>
                    </div>
                )}

                {/* Unlock Date */}
                {unlocked && unlockedAt && (
                    <div className="mb-4 px-4 text-center text-xs text-gray-500">
                        Desbloqueado em {new Date(unlockedAt).toLocaleDateString('pt-BR')}
                    </div>
                )}

                {/* Points and Category */}
                <div className="flex items-center justify-between pt-4 border-t px-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#8B7355]" />
                        <span className="text-sm font-semibold text-[#8B7355]">
                            +{points} pts
                        </span>
                    </div>
                    <ClientBadge variant="default">
                        {category}
                    </ClientBadge>
                </div>
            </ClientCard>
        </motion.div>
    );
}
