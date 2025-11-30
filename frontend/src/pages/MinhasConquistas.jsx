import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Trophy,
    Star,
    Target,
    Award,
    Lock,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientEmptyState,
    ClientBadge
} from '@/components/client';

// Services
import { achievementService } from '../services/achievementService';
import { useAuth } from '../context/AuthContext';

export default function MinhasConquistas() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: achievements = [], isLoading } = useQuery({
        queryKey: ['my-achievements'],
        queryFn: achievementService.getMyAchievements,
        enabled: !!user
    });

    // Mock data for demonstration
    const mockAchievements = [
        {
            id: 1,
            name: 'Primeira Compra',
            description: 'Realize sua primeira compra',
            icon: '🛍️',
            progress: 100,
            total: 1,
            unlocked: true,
            points: 50,
            category: 'Compras'
        },
        {
            id: 2,
            name: 'Cliente Fiel',
            description: 'Faça 5 compras',
            icon: '💎',
            progress: 3,
            total: 5,
            unlocked: false,
            points: 100,
            category: 'Compras'
        },
        {
            id: 3,
            name: 'Assinante Premium',
            description: 'Mantenha assinatura por 3 meses',
            icon: '👑',
            progress: 1,
            total: 3,
            unlocked: false,
            points: 200,
            category: 'Assinatura'
        },
        {
            id: 4,
            name: 'Avaliador',
            description: 'Deixe 3 avaliações',
            icon: '⭐',
            progress: 0,
            total: 3,
            unlocked: false,
            points: 75,
            category: 'Comunidade'
        },
        {
            id: 5,
            name: 'Influenciador',
            description: 'Indique 5 amigos',
            icon: '📢',
            progress: 0,
            total: 5,
            unlocked: false,
            points: 150,
            category: 'Indicações'
        },
        {
            id: 6,
            name: 'Colecionador',
            description: 'Tenha 10 produtos diferentes',
            icon: '🎁',
            progress: 2,
            total: 10,
            unlocked: false,
            points: 250,
            category: 'Coleção'
        }
    ];

    const displayAchievements = achievements.length > 0 ? achievements : mockAchievements;
    const totalPoints = displayAchievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.points, 0);
    const unlockedCount = displayAchievements.filter(a => a.unlocked).length;

    if (isLoading) {
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
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ClientCard gradient>
                            <div className="text-center text-white">
                                <Trophy className="w-12 h-12 mx-auto mb-3" />
                                <p className="text-sm opacity-90 mb-1">Total de Pontos</p>
                                <p className="text-4xl font-bold font-['Playfair_Display']">{totalPoints}</p>
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
                                    {unlockedCount}/{displayAchievements.length}
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
                                <p className="text-sm text-gray-600 mb-1">Progresso Geral</p>
                                <p className="text-4xl font-bold text-[#8B7355] font-['Playfair_Display']">
                                    {Math.round((unlockedCount / displayAchievements.length) * 100)}%
                                </p>
                            </div>
                        </ClientCard>
                    </motion.div>
                </div>

                {/* Achievements Grid */}
                {displayAchievements.length === 0 ? (
                    <ClientEmptyState
                        icon={Trophy}
                        title="Nenhuma conquista ainda"
                        message="Comece a fazer compras e interagir para desbloquear conquistas"
                    />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayAchievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ClientCard hoverable className="relative overflow-hidden">
                                    {/* Unlocked Badge */}
                                    {achievement.unlocked && (
                                        <div className="absolute top-4 right-4">
                                            <ClientBadge variant="success">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Desbloqueado
                                            </ClientBadge>
                                        </div>
                                    )}

                                    {/* Achievement Icon */}
                                    <div className="text-center mb-4">
                                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 ${achievement.unlocked
                                                ? 'bg-gradient-to-br from-[#8B7355] to-[#7A6548] shadow-lg'
                                                : 'bg-gray-200'
                                            }`}>
                                            {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                                        </div>

                                        <h3 className={`font-bold text-xl mb-2 ${achievement.unlocked ? 'text-[#2C2419]' : 'text-gray-400'
                                            }`}>
                                            {achievement.name}
                                        </h3>

                                        <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                                            }`}>
                                            {achievement.description}
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    {!achievement.unlocked && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Progresso</span>
                                                <span>{achievement.progress}/{achievement.total}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-[#8B7355] to-[#7A6548] rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Points and Category */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-[#8B7355]" />
                                            <span className="text-sm font-semibold text-[#8B7355]">
                                                +{achievement.points} pts
                                            </span>
                                        </div>
                                        <ClientBadge variant="default">
                                            {achievement.category}
                                        </ClientBadge>
                                    </div>
                                </ClientCard>
                            </motion.div>
                        ))}
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
