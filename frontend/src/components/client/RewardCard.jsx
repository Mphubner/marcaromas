import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Lock } from 'lucide-react';
import { ClientCard, ClientButton, ClientBadge } from '@/components/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Reward Card Component
 * Displays available rewards and allows claiming
 */
export function RewardCard({ reward, onClaim, className }) {
    const [claiming, setClaiming] = useState(false);
    const { id, name, description, type, value, requiredPoints, eligible } = reward;

    const getRewardIcon = (type) => {
        switch (type) {
            case 'DISCOUNT':
                return '💰';
            case 'CREDIT':
                return '💳';
            case 'FREE_SHIPPING':
                return '🚚';
            case 'EXCLUSIVE_CONTENT':
                return '🎁';
            default:
                return '✨';
        }
    };

    const getRewardValue = (type, value) => {
        switch (type) {
            case 'DISCOUNT':
                return `${value}% OFF`;
            case 'CREDIT':
                return `R$ ${value.toFixed(2)}`;
            case 'FREE_SHIPPING':
                return 'Frete Grátis';
            case 'EXCLUSIVE_CONTENT':
                return 'Acesso Premium';
            default:
                return value;
        }
    };

    const handleClaim = async () => {
        if (!eligible) {
            toast.error('Você não possui pontos suficientes');
            return;
        }

        setClaiming(true);
        try {
            await onClaim(id);
            toast.success('Recompensa resgatada com sucesso!');
        } catch (error) {
            toast.error('Erro ao resgatar recompensa');
        } finally {
            setClaiming(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={eligible ? { scale: 1.02 } : {}}
            className={cn("relative", className)}
        >
            <ClientCard
                hoverable={eligible}
                className={cn(
                    "relative overflow-hidden",
                    !eligible && "opacity-60"
                )}
            >
                {/* Eligibility Badge */}
                <div className="absolute top-4 right-4">
                    {eligible ? (
                        <ClientBadge variant="success">
                            <Check className="w-3 h-3 mr-1" />
                            Disponível
                        </ClientBadge>
                    ) : (
                        <ClientBadge variant="locked">
                            <Lock className="w-3 h-3 mr-1" />
                            Bloqueado
                        </ClientBadge>
                    )}
                </div>

                {/* Reward Icon & Info */}
                <div className="text-center mb-4">
                    <div className={cn(
                        "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-3 transition-all",
                        eligible
                            ? "bg-gradient-to-br from-[#8B7355] to-[#7A6548]"
                            : "bg-gray-200"
                    )}>
                        {eligible ? getRewardIcon(type) : <Lock className="w-8 h-8 text-gray-400" />}
                    </div>

                    <h3 className={cn(
                        "font-bold text-lg mb-1",
                        eligible ? "text-[#2C2419]" : "text-gray-400"
                    )}>
                        {name}
                    </h3>

                    <p className={cn(
                        "text-sm mb-3",
                        eligible ? "text-gray-600" : "text-gray-400"
                    )}>
                        {description}
                    </p>

                    {/* Reward Value */}
                    <div className={cn(
                        "inline-block px-4 py-2 rounded-full mb-3",
                        eligible
                            ? "bg-[#8B7355] text-white"
                            : "bg-gray-200 text-gray-500"
                    )}>
                        <p className="text-xl font-bold font-['Playfair_Display']">
                            {getRewardValue(type, value)}
                        </p>
                    </div>
                </div>

                {/* Required Points */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#8B7355]" />
                        <span className="text-sm text-gray-600">
                            {requiredPoints} pontos
                        </span>
                    </div>

                    <ClientButton
                        onClick={handleClaim}
                        disabled={!eligible || claiming}
                        size="sm"
                        variant={eligible ? "primary" : "outline"}
                    >
                        {claiming ? 'Resgatando...' : eligible ? 'Resgatar' : 'Indisponível'}
                    </ClientButton>
                </div>
            </ClientCard>
        </motion.div>
    );
}

/**
 * Rewards Grid Component
 * Displays all available rewards
 */
export function RewardsGrid({ rewards = [], totalPoints, onClaimReward, className }) {
    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2C2419] font-['Playfair_Display']">
                    Recompensas
                </h2>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Seus Pontos</p>
                    <p className="text-3xl font-bold text-[#8B7355] font-['Playfair_Display']">
                        {totalPoints}
                    </p>
                </div>
            </div>

            {rewards.length === 0 ? (
                <ClientCard>
                    <div className="text-center py-8 text-gray-500">
                        <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma recompensa disponível</p>
                    </div>
                </ClientCard>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((reward) => (
                        <RewardCard
                            key={reward.id}
                            reward={reward}
                            onClaim={onClaimReward}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
