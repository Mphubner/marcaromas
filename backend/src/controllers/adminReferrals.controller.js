import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * GET /api/admin/referrals/overview
 * Get overview statistics for referral program
 */
/**
 * GET /api/admin/referrals/overview
 * Get overview statistics for referral program
 */
export const getOverview = async (req, res) => {
    try {
        // Total referrers (users with codes)
        const totalReferrers = await prisma.referralCode.count();

        // Active referrers (with at least 1 conversion in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeReferrers = await prisma.referralConversion.groupBy({
            by: ['referrer_user_id'],
            where: {
                created_at: { gte: thirtyDaysAgo }
            }
        });

        // Total conversions
        const totalConversions = await prisma.referralConversion.count();

        // Pending rewards count
        const pendingRewards = await prisma.referralConversion.count({
            where: { reward_status: 'PENDING' }
        });

        // Total clicks for conversion rate
        const clicksData = await prisma.referralCode.aggregate({
            _sum: { clicks: true }
        });
        const totalClicks = clicksData._sum.clicks || 0;
        const conversionRate = totalClicks > 0
            ? ((totalConversions / totalClicks) * 100).toFixed(1)
            : '0.0';

        // Total revenue from referrals
        const revenueData = await prisma.referralConversion.aggregate({
            _sum: { transaction_amount: true },
            where: {
                conversion_type: { in: ['PURCHASE', 'SUBSCRIPTION'] }
            }
        });

        // Total rewards paid
        const rewardsData = await prisma.referralConversion.aggregate({
            _sum: { reward_amount: true },
            where: {
                reward_status: 'PAID'
            }
        });

        const totalRevenue = revenueData._sum.transaction_amount || 0;
        const totalRewardsPaid = rewardsData._sum.reward_amount || 0;

        const roi = totalRewardsPaid > 0 ? (totalRevenue / totalRewardsPaid).toFixed(2) : '0.00';
        const averageCac = totalConversions > 0
            ? (totalRewardsPaid / totalConversions).toFixed(2)
            : '0.00';

        res.json({
            totalReferrers,
            activeReferrers: activeReferrers.length,
            totalConversions,
            totalRevenue,
            totalRewardsPaid,
            roi: parseFloat(roi),
            averageCac: parseFloat(averageCac),
            // Frontend compatibility fields
            totalReferrals: totalReferrers, // Or totalConversions depending on meaning
            completedReferrals: totalConversions,
            pendingRewards,
            conversionRate
        });

    } catch (error) {
        console.error('Error fetching overview:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/admin/referrals/programs
 * List all referral programs
 */
export const getPrograms = async (req, res) => {
    try {
        const programs = await prisma.referralProgram.findMany({
            include: {
                _count: {
                    select: {
                        referralCodes: true,
                        referralConversions: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const formatted = await Promise.all(programs.map(async (program) => {
            // Get active referrers for this program
            const activeReferrers = await prisma.referralCode.count({
                where: {
                    program_id: program.id,
                    is_active: true,
                    conversions: { gt: 0 }
                }
            });

            // Get total cost
            const costData = await prisma.referralConversion.aggregate({
                _sum: { reward_amount: true },
                where: {
                    program_id: program.id,
                    reward_status: { in: ['APPROVED', 'PAID'] }
                }
            });

            return {
                id: program.id,
                name: program.name,
                type: program.type,
                isActive: program.is_active,
                createdAt: program.created_at,
                stats: {
                    activeReferrers,
                    conversions: program._count.referralConversions,
                    totalCost: costData._sum.reward_amount || 0
                }
            };
        }));

        res.json(formatted);

    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/admin/referrals/programs
 * Create new referral program
 */
export const createProgram = async (req, res) => {
    try {
        const {
            name,
            type,
            fixedAmount,
            percentage,
            recurringPercentage,
            maxAmount,
            triggerEvent,
            minPurchaseAmount,
            isRecurring,
            recurringDuration,
            recurringMonths,
            tierConfig
        } = req.body;

        // Validation
        if (!name || !type || !triggerEvent) {
            return res.status(400).json({
                error: 'Name, type, and trigger event are required'
            });
        }

        const program = await prisma.referralProgram.create({
            data: {
                name,
                type,
                fixed_amount: fixedAmount,
                percentage,
                recurring_percentage: recurringPercentage,
                max_amount: maxAmount,
                trigger_event: triggerEvent,
                min_purchase_amount: minPurchaseAmount,
                is_recurring: isRecurring || false,
                recurring_duration: recurringDuration,
                recurring_months: recurringMonths,
                tier_config: tierConfig,
                created_by_id: req.user?.id
            }
        });

        res.status(201).json(program);

    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/admin/referrals/programs/:id
 * Update referral program
 */
export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const program = await prisma.referralProgram.update({
            where: { id },
            data: {
                name: updates.name,
                type: updates.type,
                is_active: updates.isActive,
                fixed_amount: updates.fixedAmount,
                percentage: updates.percentage,
                recurring_percentage: updates.recurringPercentage,
                max_amount: updates.maxAmount,
                trigger_event: updates.triggerEvent,
                min_purchase_amount: updates.minPurchaseAmount,
                is_recurring: updates.isRecurring,
                recurring_duration: updates.recurringDuration,
                recurring_months: updates.recurringMonths,
                tier_config: updates.tierConfig
            }
        });

        res.json(program);

    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * DELETE /api/admin/referrals/programs/:id
 * Delete referral program
 */
export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if program has conversions
        const conversionsCount = await prisma.referralConversion.count({
            where: { program_id: id }
        });

        if (conversionsCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete program with existing conversions. Set it to inactive instead.'
            });
        }

        await prisma.referralProgram.delete({
            where: { id }
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/admin/referrals/conversions
 * List all conversions with filters
 */
export const getConversions = async (req, res) => {
    try {
        const { status, type, dateFrom, dateTo, minAmount, limit = 100 } = req.query;

        const where = {};

        if (status) where.reward_status = status;
        if (type) where.conversion_type = type;
        if (minAmount) where.transaction_amount = { gte: parseFloat(minAmount) };

        if (dateFrom || dateTo) {
            where.created_at = {};
            if (dateFrom) where.created_at.gte = new Date(dateFrom);
            if (dateTo) where.created_at.lte = new Date(dateTo);
        }

        const conversions = await prisma.referralConversion.findMany({
            where,
            include: {
                referralCode: {
                    include: {
                        program: true
                    }
                },
                order: {
                    include: {
                        user: true
                    }
                },
                subscription: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: parseInt(limit)
        });

        // Get referrer and referred user data
        const formatted = await Promise.all(conversions.map(async (c) => {
            const referrer = await prisma.user.findUnique({
                where: { id: c.referrer_user_id },
                select: { id: true, name: true, email: true }
            });

            const referred = await prisma.user.findUnique({
                where: { id: c.referred_user_id },
                select: { id: true, name: true, email: true }
            });

            const statusMap = {
                'PENDING': 'pending',
                'APPROVED': 'completed',
                'PAID': 'rewarded',
                'CANCELLED': 'cancelled'
            };

            return {
                id: c.id,
                referrerName: referrer?.name,
                referrer_email: referrer?.email,
                referral_code: c.referralCode.code,
                referredName: referred?.name,
                referred_email: referred?.email,
                status: statusMap[c.reward_status] || c.reward_status.toLowerCase(),
                reward_amount: c.reward_amount,
                rewardPaid: c.reward_status === 'PAID',
                paidAt: c.paid_at,
                createdAt: c.created_at,
                completedAt: c.paid_at || c.created_at, // Fallback
                notes: null,

                // Original fields
                referrer,
                referred,
                type: c.conversion_type,
                amount: c.transaction_amount,
                reward: c.reward_amount,
                program: c.referralCode.program.name,
                isRecurring: c.is_recurring
            };
        }));

        res.json(formatted);

    } catch (error) {
        console.error('Error fetching conversions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/admin/referrals/conversions/:id/approve
 * Approve a pending conversion
 */
export const approveConversion = async (req, res) => {
    try {
        const { id } = req.params;

        const conversion = await prisma.referralConversion.update({
            where: { id },
            data: {
                reward_status: 'APPROVED'
            }
        });

        // Update referral code totals
        await prisma.referralCode.update({
            where: { id: conversion.referral_code_id },
            data: {
                conversions: { increment: 1 },
                total_earned: { increment: conversion.reward_amount }
            }
        });

        res.json({ success: true, conversion });

    } catch (error) {
        console.error('Error approving conversion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/admin/referrals/conversions/:id/reject
 * Reject a conversion
 */
export const rejectConversion = async (req, res) => {
    try {
        const { id } = req.params;

        const conversion = await prisma.referralConversion.update({
            where: { id },
            data: {
                reward_status: 'CANCELLED'
            }
        });

        res.json({ success: true, conversion });

    } catch (error) {
        console.error('Error rejecting conversion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/admin/referrals/batch-payout
 * Process payout for multiple conversions
 */
export const batchPayout = async (req, res) => {
    try {
        const { conversionIds, payoutMethod } = req.body;

        if (!conversionIds || conversionIds.length === 0) {
            return res.status(400).json({ error: 'No conversions selected' });
        }

        // Update conversions to PAID
        const updated = await prisma.referralConversion.updateMany({
            where: {
                id: { in: conversionIds },
                reward_status: 'APPROVED'
            },
            data: {
                reward_status: 'PAID',
                paid_at: new Date()
            }
        });

        res.json({
            success: true,
            processedCount: updated.count
        });

    } catch (error) {
        console.error('Error processing batch payout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/admin/referrals/payouts
 * Get all payout requests
 */
export const getPayouts = async (req, res) => {
    try {
        const { status } = req.query;

        const where = {};
        if (status) where.status = status;

        const payouts = await prisma.referralPayout.findMany({
            where,
            orderBy: { requested_at: 'desc' }
        });

        // Get user data for each payout
        const formatted = await Promise.all(payouts.map(async (payout) => {
            const user = await prisma.user.findUnique({
                where: { id: payout.user_id },
                select: { id: true, name: true, email: true }
            });

            return {
                ...payout,
                user
            };
        }));

        res.json(formatted);

    } catch (error) {
        console.error('Error fetching payouts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/admin/referrals/payouts/:id/process
 * Process a payout request
 */
export const processPayout = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const payout = await prisma.referralPayout.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                processed_at: new Date(),
                completed_at: new Date(),
                notes
            }
        });

        // Mark conversions as PAID
        await prisma.referralConversion.updateMany({
            where: {
                id: { in: payout.conversion_ids }
            },
            data: {
                reward_status: 'PAID',
                paid_at: new Date()
            }
        });

        res.json({ success: true, payout });

    } catch (error) {
        console.error('Error processing payout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
