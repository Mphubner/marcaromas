import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Generate unique referral code for user
function generateReferralCode(userName) {
    const cleanName = userName.replace(/\s+/g, '').toUpperCase().substring(0, 6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${cleanName}${randomNum}`;
}

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * GET /api/referrals/my-dashboard
 * Fetch user's referral dashboard data
 */
export const getMyDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get or create referral code
        let referralCode = await prisma.referralCode.findFirst({
            where: { user_id: userId },
            include: { program: true }
        });

        // If user doesn't have a code yet, create one
        if (!referralCode) {
            // Get active program
            const activeProgram = await prisma.referralProgram.findFirst({
                where: { is_active: true },
                orderBy: { created_at: 'desc' }
            });

            if (!activeProgram) {
                return res.status(400).json({
                    error: 'No active referral program found'
                });
            }

            // Generate unique code
            let code = generateReferralCode(req.user.name);
            let attempts = 0;
            while (attempts < 10) {
                const existing = await prisma.referralCode.findUnique({
                    where: { code }
                });
                if (!existing) break;
                code = generateReferralCode(req.user.name);
                attempts++;
            }

            referralCode = await prisma.referralCode.create({
                data: {
                    user_id: userId,
                    code,
                    program_id: activeProgram.id
                },
                include: { program: true }
            });
        }

        // Get conversions
        const conversions = await prisma.referralConversion.findMany({
            where: { referrer_user_id: userId },
            include: {
                order: true,
                subscription: true
            },
            orderBy: { created_at: 'desc' }
        });

        // Calculate stats
        const totalEarned = conversions.reduce((sum, c) =>
            c.reward_status === 'PAID' ? sum + c.reward_amount : sum, 0
        );

        const pendingEarnings = conversions.reduce((sum, c) =>
            c.reward_status === 'APPROVED' || c.reward_status === 'PENDING'
                ? sum + c.reward_amount : sum, 0
        );

        const conversionRate = referralCode.clicks > 0
            ? ((conversions.length / referralCode.clicks) * 100).toFixed(1)
            : '0.0';

        // Get channel breakdown
        const clicks = await prisma.referralClick.findMany({
            where: { referral_code_id: referralCode.id }
        });

        const channelStats = clicks.reduce((acc, click) => {
            const platform = click.social_platform || 'DIRECT';
            acc[platform] = (acc[platform] || 0) + 1;
            return acc;
        }, {});

        const topChannels = Object.entries(channelStats)
            .map(([platform, count]) => ({ platform, conversions: count }))
            .sort((a, b) => b.conversions - a.conversions)
            .slice(0, 5);

        // Generate shareable links
        const baseUrl = process.env.FRONTEND_URL || 'https://marcaromas.com.br';
        const links = {
            general: `${baseUrl}?ref=${referralCode.code}`,
            store: `${baseUrl}/loja?ref=${referralCode.code}`,
            club: `${baseUrl}/clube?ref=${referralCode.code}`
        };

        res.json({
            referralCode: referralCode.code,
            stats: {
                totalClicks: referralCode.clicks,
                totalSignups: referralCode.signups,
                totalConversions: referralCode.conversions,
                conversionRate: `${conversionRate}%`,
                totalEarned,
                pendingEarnings,
                paidOut: totalEarned - pendingEarnings
            },
            recentConversions: conversions.slice(0, 10).map(c => ({
                id: c.id,
                type: c.conversion_type,
                amount: c.transaction_amount,
                reward: c.reward_amount,
                status: c.reward_status,
                isRecurring: c.is_recurring,
                createdAt: c.created_at
            })),
            topPerformingChannels: topChannels,
            links
        });

    } catch (error) {
        console.error('Error fetching referral dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/referrals/my-conversions
 * Get detailed list of user's conversions
 */
export const getMyConversions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, dateFrom, dateTo, limit = 50 } = req.query;

        const where = { referrer_user_id: userId };

        if (status) {
            where.reward_status = status;
        }

        if (dateFrom || dateTo) {
            where.created_at = {};
            if (dateFrom) where.created_at.gte = new Date(dateFrom);
            if (dateTo) where.created_at.lte = new Date(dateTo);
        }

        const conversions = await prisma.referralConversion.findMany({
            where,
            include: {
                order: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                },
                subscription: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: parseInt(limit)
        });

        const formatted = conversions.map(c => {
            const referredUser = c.order?.user || c.subscription?.user;

            return {
                id: c.id,
                referredUser: referredUser ? {
                    name: referredUser.name,
                    email: referredUser.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
                } : null,
                type: c.conversion_type,
                amount: c.transaction_amount,
                reward: c.reward_amount,
                status: c.reward_status,
                isRecurring: c.is_recurring,
                nextPayment: c.is_recurring && c.subscription ?
                    c.subscription.nextBilling : null,
                createdAt: c.created_at
            };
        });

        res.json(formatted);

    } catch (error) {
        console.error('Error fetching conversions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/referrals/share
 * Generate shareable link for specific platform
 */
export const generateShareLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, message } = req.body;

        const referralCode = await prisma.referralCode.findFirst({
            where: { user_id: userId }
        });

        if (!referralCode) {
            return res.status(404).json({ error: 'Referral code not found' });
        }

        const baseUrl = process.env.FRONTEND_URL || 'https://marcaromas.com.br';
        const refUrl = `${baseUrl}?ref=${referralCode.code}`;

        const defaultMessage = message ||
            `Olha essa loja incrível de velas artesanais! Use meu link para ganhar desconto: ${refUrl}`;

        let url;
        switch (platform.toUpperCase()) {
            case 'WHATSAPP':
                url = `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
                break;
            case 'INSTAGRAM':
                url = refUrl; // Instagram stories need manual sharing
                break;
            case 'FACEBOOK':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refUrl)}`;
                break;
            case 'EMAIL':
                url = `mailto:?subject=${encodeURIComponent('Confira Marcáromas')}&body=${encodeURIComponent(defaultMessage)}`;
                break;
            default:
                url = refUrl;
        }

        // Track share intent (optional)
        const trackingCode = `${referralCode.code}_${platform}_${Date.now()}`;

        res.json({
            url,
            trackingCode,
            referralCode: referralCode.code
        });

    } catch (error) {
        console.error('Error generating share link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/referrals/request-payout
 * Request payout of accumulated earnings
 */
export const requestPayout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, method, pixKey } = req.body;

        // Validate amount
        if (!amount || amount < 50) {
            return res.status(400).json({
                error: 'Minimum payout amount is R$ 50.00'
            });
        }

        // Get approved conversions
        const conversions = await prisma.referralConversion.findMany({
            where: {
                referrer_user_id: userId,
                reward_status: 'APPROVED'
            }
        });

        const availableAmount = conversions.reduce((sum, c) => sum + c.reward_amount, 0);

        if (amount > availableAmount) {
            return res.status(400).json({
                error: `Insufficient available balance. Available: R$ ${availableAmount.toFixed(2)}`
            });
        }

        // Validate payout method
        if (!['PIX', 'BANK_TRANSFER', 'STORE_CREDIT', 'DISCOUNT_COUPON'].includes(method)) {
            return res.status(400).json({ error: 'Invalid payout method' });
        }

        if (method === 'PIX' && !pixKey) {
            return res.status(400).json({ error: 'PIX key is required' });
        }

        // Create payout request
        const payout = await prisma.referralPayout.create({
            data: {
                user_id: userId,
                amount,
                conversion_ids: conversions.map(c => c.id),
                payout_method: method,
                pix_key: pixKey,
                status: 'PENDING'
            }
        });

        res.json({
            success: true,
            payout: {
                id: payout.id,
                amount: payout.amount,
                method: payout.payout_method,
                status: payout.status,
                requestedAt: payout.requested_at
            }
        });

    } catch (error) {
        console.error('Error requesting payout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/referrals/my-payouts
 * Get payout history
 */
export const getMyPayouts = async (req, res) => {
    try {
        const userId = req.user.id;

        const payouts = await prisma.referralPayout.findMany({
            where: { user_id: userId },
            orderBy: { requested_at: 'desc' }
        });

        res.json(payouts);

    } catch (error) {
        console.error('Error fetching payouts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
