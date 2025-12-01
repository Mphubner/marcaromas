import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { ClientCard } from '@/components/client';
import { cn } from '@/lib/utils';

/**
 * Leaderboard Card Component
 * Displays top users by points with rankings
 */
export function LeaderboardCard({ leaderboard = [], currentUserId, className }) {
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-700" />;
            default:
                return null;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300";
            case 2:
                return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300";
            case 3:
                return "bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300";
            default:
                return "bg-white";
        }
    };

    return (
        <ClientCard
            title="🏆 Ranking de Pontos"
            description="Top 10 usuários com mais pontos"
            className={className}
        >
            <div className="space-y-2">
                {leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum usuário no ranking ainda</p>
                    </div>
                ) : (
                    leaderboard.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "flex items-center gap-4 p-3 rounded-xl border-2 transition-all",
                                getRankColor(user.rank),
                                user.id === currentUserId && "ring-2 ring-[#8B7355] shadow-lg"
                            )}
                        >
                            {/* Rank */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 font-bold text-lg">
                                {getRankIcon(user.rank) || `#${user.rank}`}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "font-semibold truncate",
                                    user.id === currentUserId && "text-[#8B7355]"
                                )}>
                                    {user.name}
                                    {user.id === currentUserId && " (Você)"}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {user.achievementCount} conquista{user.achievementCount !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className="text-2xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                    {user.points}
                                </p>
                                <p className="text-xs text-gray-600">pontos</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </ClientCard>
    );
}
