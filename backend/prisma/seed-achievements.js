import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const achievements = [
    // BRONZE TIER (50-100 pts)
    {
        name: 'Primeira Compra',
        description: 'Realize sua primeira compra na loja',
        icon: '🛍️',
        category: 'COMPRAS',
        tier: 'BRONZE',
        points: 50,
        requirementType: 'purchase_count',
        requirementTarget: 1,
    },
    {
        name: 'Bem-Vindo',
        description: 'Complete seu perfil com todas as informações',
        icon: '👋',
        category: 'COMUNIDADE',
        tier: 'BRONZE',
        points: 75,
        requirementType: 'profile_complete',
        requirementTarget: 1,
    },
    {
        name: 'Primeira Avaliação',
        description: 'Deixe sua primeira avaliação de produto',
        icon: '⭐',
        category: 'COMUNIDADE',
        tier: 'BRONZE',
        points: 50,
        requirementType: 'review_count',
        requirementTarget: 1,
    },

    // SILVER TIER (150-300 pts)
    {
        name: 'Cliente Fiel',
        description: 'Faça 5 compras na loja',
        icon: '💎',
        category: 'COMPRAS',
        tier: 'SILVER',
        points: 200,
        requirementType: 'purchase_count',
        requirementTarget: 5,
    },
    {
        name: 'Crítico Experiente',
        description: 'Deixe 5 avaliações de produtos',
        icon: '📝',
        category: 'COMUNIDADE',
        tier: 'SILVER',
        points: 150,
        requirementType: 'review_count',
        requirementTarget: 5,
    },
    {
        name: 'Assinante Iniciante',
        description: 'Mantenha assinatura ativa por 1 mês',
        icon: '📦',
        category: 'ASSINATURA',
        tier: 'SILVER',
        points: 150,
        requirementType: 'subscription_months',
        requirementTarget: 1,
    },
    {
        name: 'Primeiro Indicado',
        description: 'Indique 2 amigos que fizeram compra',
        icon: '🎯',
        category: 'INDICACOES',
        tier: 'SILVER',
        points: 200,
        requirementType: 'referral_count',
        requirementTarget: 2,
    },

    // GOLD TIER (400-600 pts)
    {
        name: 'Comprador VIP',
        description: 'Complete 10 compras na loja',
        icon: '👑',
        category: 'COMPRAS',
        tier: 'GOLD',
        points: 500,
        requirementType: 'purchase_count',
        requirementTarget: 10,
    },
    {
        name: 'Influenciador',
        description: 'Consiga 5 indicações bem-sucedidas',
        icon: '📢',
        category: 'INDICACOES',
        tier: 'GOLD',
        points: 400,
        requirementType: 'referral_count',
        requirementTarget: 5,
    },
    {
        name: 'Assinante Comprometido',
        description: 'Mantenha assinatura ativa por 3 meses',
        icon: '🏆',
        category: 'ASSINATURA',
        tier: 'GOLD',
        points: 400,
        requirementType: 'subscription_months',
        requirementTarget: 3,
    },
    {
        name: 'Colecionador',
        description: 'Tenha 10 produtos diferentes',
        icon: '🎁',
        category: 'COLECAO',
        tier: 'GOLD',
        points: 450,
        requirementType: 'product_collection',
        requirementTarget: 10,
    },

    // PLATINUM TIER (700-1000 pts)
    {
        name: 'Patrono',
        description: 'Complete 20 compras na loja',
        icon: '💰',
        category: 'COMPRAS',
        tier: 'PLATINUM',
        points: 800,
        requirementType: 'purchase_count',
        requirementTarget: 20,
    },
    {
        name: 'Embaixador',
        description: 'Consiga 10 indicações bem-sucedidas',
        icon: '🌟',
        category: 'INDICACOES',
        tier: 'PLATINUM',
        points: 700,
        requirementType: 'referral_count',
        requirementTarget: 10,
    },
    {
        name: 'Membro Premium',
        description: 'Mantenha assinatura ativa por 6 meses',
        icon: '🎖️',
        category: 'ASSINATURA',
        tier: 'PLATINUM',
        points: 750,
        requirementType: 'subscription_months',
        requirementTarget: 6,
    },
    {
        name: 'Grande Colecionador',
        description: 'Tenha 20 produtos diferentes',
        icon: '🏛️',
        category: 'COLECAO',
        tier: 'PLATINUM',
        points: 800,
        requirementType: 'product_collection',
        requirementTarget: 20,
    },

    // DIAMOND TIER (1500+ pts)
    {
        name: 'Lenda',
        description: 'Complete 50 compras na loja',
        icon: '💫',
        category: 'COMPRAS',
        tier: 'DIAMOND',
        points: 2000,
        requirementType: 'purchase_count',
        requirementTarget: 50,
    },
    {
        name: 'Mega Influenciador',
        description: 'Consiga 20 indicações bem-sucedidas',
        icon: '🚀',
        category: 'INDICACOES',
        tier: 'DIAMOND',
        points: 1500,
        requirementType: 'referral_count',
        requirementTarget: 20,
    },
    {
        name: 'Assinante Eterno',
        description: 'Mantenha assinatura ativa por 12 meses',
        icon: '🌠',
        category: 'ASSINATURA',
        tier: 'DIAMOND',
        points: 1500,
        requirementType: 'subscription_months',
        requirementTarget: 12,
    },
    {
        name: 'Mestre Colecionador',
        description: 'Tenha 50 produtos diferentes',
        icon: '🎭',
        category: 'COLECAO',
        tier: 'DIAMOND',
        points: 1800,
        requirementType: 'product_collection',
        requirementTarget: 50,
    },
];

const rewards = [
    {
        name: '5% de Desconto',
        description: 'Ganhe 5% de desconto em sua próxima compra',
        type: 'DISCOUNT',
        value: 5,
        requiredPoints: 200,
        isActive: true,
    },
    {
        name: 'R$ 20 em Créditos',
        description: 'Receba R$ 20 em créditos para usar na loja',
        type: 'CREDIT',
        value: 20,
        requiredPoints: 400,
        isActive: true,
    },
    {
        name: 'Frete Grátis',
        description: 'Frete grátis em sua próxima compra',
        type: 'FREE_SHIPPING',
        value: 0,
        requiredPoints: 300,
        isActive: true,
    },
    {
        name: '10% de Desconto',
        description: 'Ganhe 10% de desconto em sua próxima compra',
        type: 'DISCOUNT',
        value: 10,
        requiredPoints: 500,
        isActive: true,
    },
    {
        name: 'R$ 50 em Créditos',
        description: 'Receba R$ 50 em créditos para usar na loja',
        type: 'CREDIT',
        value: 50,
        requiredPoints: 800,
        isActive: true,
    },
    {
        name: 'Conteúdo Exclusivo Premium',
        description: 'Acesso a conteúdo exclusivo por 1 mês',
        type: 'EXCLUSIVE_CONTENT',
        value: 0,
        requiredPoints: 600,
        isActive: true,
    },
    {
        name: '15% de Desconto VIP',
        description: 'Ganhe 15% de desconto em sua próxima compra',
        type: 'DISCOUNT',
        value: 15,
        requiredPoints: 1000,
        isActive: true,
    },
    {
        name: 'R$ 100 em Créditos Elite',
        description: 'Receba R$ 100 em créditos para usar na loja',
        type: 'CREDIT',
        value: 100,
        requiredPoints: 1500,
        isActive: true,
    },
];

async function seedAchievements() {
    console.log('Seeding achievements...');

    // Delete existing data
    await prisma.userAchievement.deleteMany({});
    await prisma.achievement.deleteMany({});
    await prisma.achievementReward.deleteMany({});

    // Create achievements
    for (const achievement of achievements) {
        await prisma.achievement.create({
            data: achievement,
        });
    }

    console.log(`✅ Created ${achievements.length} achievements`);

    // Create rewards
    for (const reward of rewards) {
        await prisma.achievementReward.create({
            data: reward,
        });
    }

    console.log(`✅ Created ${rewards.length} rewards`);

    await prisma.$disconnect();
}

seedAchievements()
    .catch((e) => {
        console.error('Error seeding achievements:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
