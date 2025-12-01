import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Trophy,
    Star,
    Target,
    Award,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientEmptyState,
    ClientTabs,
    AchievementCard,
    LeaderboardCard,
    RewardsGrid
} from '@/components/client';

// Services
import { achievementService } from '../services/achievementService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
    { id: 'ALL', label: 'Todas', icon: Trophy },
    { id: 'COMPRAS', label: 'Compras', icon: '🛍️' },
    { id: 'ASSINATURA', label: 'Assinatura', icon: '📦' },
    { id: 'COMUNIDADE', label: 'Comunidade', icon: '⭐' },
    { id: 'INDICACOES', label: 'Indicações', icon: '📢' },
    { id: 'COLECAO', label: 'Coleção', icon: '🎁' },
];

const TABS = [
    { id: 'achievements', label: 'Conquistas' },
    { id: 'rewards', label: 'Recompensas' },
    { id: 'leaderboard', label: 'Ranking' },
];

export default function MinhasConquistas() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('achievements');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Fetch achievements
    const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
        queryKey: ['my-achievements', selectedCategory === 'ALL' ? null : selectedCategory],
        queryFn: () => achievementService.getMyAchievements(
            selectedCategory === 'ALL' ? null : selectedCategory
        ),
        enabled: !!user && activeTab === 'achievements',
    });

    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ['achievement-stats'],
        queryFn: achievementService.getMyStats,
        enabled: !!user,
    });

    // Fetch leaderboard
    const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => achievementService.getLeaderboard(10),
        enabled: !!user && activeTab === 'leaderboard',
    });

    // Fetch rewards
    const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
        queryKey: ['rewards'],
        queryFn: achievementService.getRewards,
        enabled: !!user && activeTab === 'rewards',
    });

    const handleClaimReward = async (rewardId) => {
        await achievementService.claimReward(rewardId);
        // Refetch rewards after claiming
        // queryClient.invalidateQueries(['rewards']);
    };

    // Group achievements by status
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);
    const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0);

    if (achievementsLoading && activeTab === 'achievements') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Minhas Conquistas"
                    subtitle="Acompanhe seu progresso e desbloqueie recompensas"
                    backTo="/dashboard"
                />

                {/* Stats Summary */}
                {stats && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <ClientCard gradient>
                                <div className="text-center text-white">
                                    <Trophy className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-sm opacity-90 mb-1">Total de Pontos</p>
                                    <p className="text-4xl font-bold font-['Playfair_Display']">{stats.totalPoints}</p>
                                </div>
                            </ClientCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ClientCard>
                                <div className="text-center">
                                    <Star className="w-12 h-12 mx-auto mb-3 text-[#8B7355]" />
                                    <p className="text-sm text-gray-600 mb-1">Desbloqueadas</p>
                                    <p className="text-4xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                        {stats.achievementsUnlocked}/{stats.totalAchievements}
                                    </p>
                                </div>
                            </ClientCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ClientCard>
                                <div className="text-center">
                                    <Target className="w-12 h-12 mx-auto mb-3 text-[#8B7355]" />
                                    <p className="text-sm text-gray-600 mb-1">Seu Ranking</p>
                                    <p className="text-4xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                        #{stats.rank}
                                    </p>
                                </div>
                            </ClientCard>
                        </motion.div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-8">
                    <ClientTabs
                        tabs={TABS}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </div>

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <>
                        {/* Category Filter */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-semibold text-gray-700">Categoria:</span>
                                {CATEGORIES.map((category) => (
                                    <ClientButton
                                        key={category.id}
                                        variant={selectedCategory === category.id ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {typeof category.icon === 'string' ? category.icon : <category.icon className="w-4 h-4 mr-1" />}
                                        {category.label}
                                    </ClientButton>
                                ))}
                            </div>
                        </div>

                        {achievements.length === 0 ? (
                            <ClientEmptyState
                                icon={Trophy}
                                title="Nenhuma conquista nesta categoria"
                                message="Explore outras categorias ou comece a interagir para desbloquear conquistas"
                            />
                        ) : (
                            <>
                                {/* Unlocked Achievements */}
                                {unlockedAchievements.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display'] flex items-center gap-2">
                                            <Award className="w-6 h-6" />
                                            Conquistas Desbloqueadas ({unlockedAchievements.length})
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {unlockedAchievements.map((achievement, index) => (
                                                <AchievementCard
                                                    key={achievement.id}
                                                    achievement={achievement}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* In Progress Achievements */}
                                {inProgressAchievements.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display'] flex items-center gap-2">
                                            <Target className="w-6 h-6" />
                                            Progresso em Andamento ({inProgressAchievements.length})
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {inProgressAchievements.map((achievement, index) => (
                                                <AchievementCard
                                                    key={achievement.id}
                                                    achievement={achievement}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Locked Achievements */}
                                {lockedAchievements.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display'] flex items-center gap-2">
                                            🔒 Conquistas Bloqueadas ({lockedAchievements.length})
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {lockedAchievements.map((achievement, index) => (
                                                <AchievementCard
                                                    key={achievement.id}
                                                    achievement={achievement}
                                                    index={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                    <RewardsGrid
                        rewards={rewardsData?.rewards || []}
                        totalPoints={rewardsData?.totalPoints || 0}
                        onClaimReward={handleClaimReward}
                    />
                )}

                {/* Leaderboard Tab */}
                {activeTab === 'leaderboard' && (
                    <div className="max-w-3xl mx-auto">
                        <LeaderboardCard
                            leaderboard={leaderboard}
                            currentUserId={user?.id}
                        />
                    </div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                >
                    <ClientCard gradient>
                        <div className="text-center text-white py-8">
                            <Trophy className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2 font-['Playfair_Display']">
                                Continue Conquistando!
                            </h3>
                            <p className="mb-6 opacity-90">
                                Faça mais compras e interaja com a comunidade para desbloquear conquistas
                            </p>
                            <div className="flex gap-4 justify-center">
                                <ClientButton variant="secondary" onClick={() => navigate('/loja')}>
                                    Ir para Loja
                                </ClientButton>
                                <ClientButton variant="secondary" onClick={() => navigate('/clube')}>
                                    Assinar Club
                                </ClientButton>
                            </div>
                        </div>
                    </ClientCard>
                </motion.div>
            </div>
        </div>
    );
}
