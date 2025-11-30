import { prisma } from '../lib/prisma.js';

// Helper para calcular date range
const getDateRange = (period, startDate, endDate) => {
  if (startDate && endDate) {
    return { start: new Date(startDate), end: new Date(endDate) };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return { start: today, end: now };
    case '7d':
      const week = new Date(today);
      week.setDate(week.getDate() - 7);
      return { start: week, end: now };
    case '30d':
      const month = new Date(today);
      month.setDate(month.getDate() - 30);
      return { start: month, end: now };
    case '90d':
      const quarter = new Date(today);
      quarter.setDate(quarter.getDate() - 90);
      return { start: quarter, end: now };
    default:
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 30);
      return { start: defaultStart, end: now };
  }
};

export const getAnalyticsData = async (req, res, next) => {
  try {
    const {
      period = '30d',
      startDate,
      endDate,
      channel,
      segment,
      type = 'all'
    } = req.query;

    const dateRange = getDateRange(period, startDate, endDate);

    // Fetch orders with filters
    const whereClause = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    };

    if (channel) {
      whereClause.channel = channel;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch subscriptions created in period (for revenue calculation)
    const newSubscriptions = await prisma.subscription.findMany({
      where: {
        startedAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      include: { plan: true },
    });

    // Previous period for comparison
    const periodDiff = dateRange.end - dateRange.start;
    const previousStart = new Date(dateRange.start.getTime() - periodDiff);
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStart,
          lt: dateRange.start,
        },
      },
    });

    // Fetch all users for customer analytics
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Fetch subscriptions for churn analysis
    const subscriptions = await prisma.subscription.findMany({
      include: { plan: true },
    });

    // ===== 1. REVENUE ANALYTICS =====
    const ordersRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const subscriptionsRevenue = newSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);

    let totalRevenue = 0;
    if (type === 'orders') {
      totalRevenue = ordersRevenue;
    } else if (type === 'subscriptions') {
      totalRevenue = subscriptionsRevenue;
    } else {
      totalRevenue = ordersRevenue + subscriptionsRevenue;
    }

    // Previous revenue (Simplified)
    const previousRevenue = previousOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenueGrowth = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // Revenue by day
    const revenueByDay = {};

    if (type !== 'subscriptions') {
      orders.forEach(order => {
        const day = new Date(order.createdAt).toLocaleDateString('pt-BR');
        revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
      });
    }

    if (type !== 'orders') {
      newSubscriptions.forEach(sub => {
        const day = new Date(sub.startedAt).toLocaleDateString('pt-BR');
        revenueByDay[day] = (revenueByDay[day] || 0) + (sub.plan?.price || 0);
      });
    }

    const revenueTimeSeriesData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
      });

    // Revenue by channel (Only for orders usually, but could be adapted)
    const revenueByChannel = {};
    if (type !== 'subscriptions') {
      orders.forEach(order => {
        revenueByChannel[order.channel] = (revenueByChannel[order.channel] || 0) + order.total;
      });
    }

    // Simple revenue forecast (linear trend)
    const avgDailyRevenue = totalRevenue / Math.max(Object.keys(revenueByDay).length, 1);
    const forecastDays = 30;
    const revenueForecast = Array.from({ length: forecastDays }, (_, i) => ({
      day: i + 1,
      predicted: avgDailyRevenue * (i + 1),
    }));

    // ===== 2. CUSTOMER ANALYTICS =====
    const totalCustomers = allUsers.length;
    const newCustomersThisPeriod = allUsers.filter(
      u => u.createdAt >= dateRange.start && u.createdAt <= dateRange.end
    ).length;

    // Customer Lifetime Value
    const customerOrders = {};
    orders.forEach(order => {
      if (order.userId) {
        if (!customerOrders[order.userId]) {
          customerOrders[order.userId] = [];
        }
        customerOrders[order.userId].push(order);
      }
    });

    const clvData = Object.values(customerOrders).map(userOrders => {
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      const orderCount = userOrders.length;
      return { totalSpent, orderCount };
    });

    const averageCLV = clvData.length > 0
      ? clvData.reduce((sum, c) => sum + c.totalSpent, 0) / clvData.length
      : 0;

    // RFM Segmentation
    const now = new Date();
    const rfmSegments = Object.entries(customerOrders).map(([userId, userOrders]) => {
      const mostRecent = Math.max(...userOrders.map(o => new Date(o.createdAt).getTime()));
      const recency = Math.floor((now - mostRecent) / (1000 * 60 * 60 * 24)); // days
      const frequency = userOrders.length;
      const monetary = userOrders.reduce((sum, o) => sum + o.total, 0);

      return { userId: parseInt(userId), recency, frequency, monetary };
    });

    // Customer distribution (new vs returning)
    const returningCustomers = Object.keys(customerOrders).filter(
      userId => customerOrders[userId].length > 1
    ).length;
    const newCustomers = Object.keys(customerOrders).filter(
      userId => customerOrders[userId].length === 1
    ).length;

    // Churn rate (from subscriptions)
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const canceledSubscriptions = subscriptions.filter(s => s.status === 'canceled').length;
    const churnRate = subscriptions.length > 0
      ? (canceledSubscriptions / subscriptions.length) * 100
      : 0;

    // Retention rate
    const retentionRate = 100 - churnRate;

    // ===== 3. ORDER ANALYTICS =====
    const totalOrders = orders.length;
    const ordersGrowth = previousOrders.length > 0
      ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
      : 0;

    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const previousAOV = previousOrders.length > 0
      ? previousOrders.reduce((sum, o) => sum + o.total, 0) / previousOrders.length
      : 0;
    const aovGrowth = previousAOV > 0 ? ((aov - previousAOV) / previousAOV) * 100 : 0;

    // Delivery performance
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const avgDeliveryTime = deliveredOrders
      .filter(o => o.createdAt && o.deliveredAt)
      .reduce((sum, o) => {
        const days = (new Date(o.deliveredAt) - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / Math.max(deliveredOrders.filter(o => o.deliveredAt).length, 1);

    const onTimeDeliveries = deliveredOrders.filter(o => {
      if (!o.estimatedDeliveryDate || !o.deliveredAt) return false;
      return new Date(o.deliveredAt) <= new Date(o.estimatedDeliveryDate);
    }).length;

    const deliverySuccessRate = deliveredOrders.length > 0
      ? (onTimeDeliveries / deliveredOrders.length) * 100
      : 0;

    // Cancellation analysis
    const canceledOrders = orders.filter(o => o.status === 'canceled');
    const cancellationRate = totalOrders > 0 ? (canceledOrders.length / totalOrders) * 100 : 0;

    const cancellationReasons = canceledOrders.reduce((acc, order) => {
      const reason = order.cancellationReason || 'Não especificado';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    // Refund analysis
    const refundedOrders = orders.filter(o => o.status === 'refunded');
    const refundRate = totalOrders > 0 ? (refundedOrders.length / totalOrders) * 100 : 0;

    // ===== 4. PRODUCT ANALYTICS =====
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?.id;
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              id: productId,
              name: item.product.name,
              category: item.product.category,
              quantity: 0,
              revenue: 0,
              orders: 0,
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.quantity * item.price;
          productSales[productId].orders += 1;
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ===== 5. GEOGRAPHIC ANALYTICS =====
    const salesByState = {};
    orders.forEach(order => {
      if (order.deliveryAddress?.state) {
        const state = order.deliveryAddress.state;
        if (!salesByState[state]) {
          salesByState[state] = { orders: 0, revenue: 0 };
        }
        salesByState[state].orders += 1;
        salesByState[state].revenue += order.total;
      }
    });

    const geographicData = Object.entries(salesByState).map(([state, data]) => ({
      state,
      ...data,
      aov: data.orders > 0 ? data.revenue / data.orders : 0,
    }));

    // ===== 6. PAYMENT ANALYTICS =====
    const paymentMethods = orders.reduce((acc, order) => {
      if (order.paymentMethod) {
        if (!acc[order.paymentMethod]) {
          acc[order.paymentMethod] = { count: 0, revenue: 0, success: 0 };
        }
        acc[order.paymentMethod].count += 1;
        acc[order.paymentMethod].revenue += order.total;
        if (order.paymentStatus === 'approved') {
          acc[order.paymentMethod].success += 1;
        }
      }
      return acc;
    }, {});

    const paymentAnalytics = Object.entries(paymentMethods).map(([method, data]) => ({
      method,
      count: data.count,
      revenue: data.revenue,
      successRate: data.count > 0 ? (data.success / data.count) * 100 : 0,
      aov: data.count > 0 ? data.revenue / data.count : 0,
    }));

    // ===== 7. COHORT ANALYSIS =====
    // Group users by signup month
    const cohorts = {};
    allUsers.forEach(user => {
      const cohortMonth = new Date(user.createdAt).toISOString().slice(0, 7); // YYYY-MM
      if (!cohorts[cohortMonth]) {
        cohorts[cohortMonth] = [];
      }
      cohorts[cohortMonth].push(user.id);
    });

    // Calculate retention by cohort
    const cohortRetention = Object.entries(cohorts).map(([month, userIds]) => {
      const cohortOrders = orders.filter(o => userIds.includes(o.userId));
      const activeUsers = new Set(cohortOrders.map(o => o.userId)).size;
      const retentionRate = userIds.length > 0 ? (activeUsers / userIds.length) * 100 : 0;

      return {
        cohort: month,
        totalUsers: userIds.length,
        activeUsers,
        retentionRate,
      };
    });

    // ===== RESPONSE =====
    return res.json({
      period: { start: dateRange.start, end: dateRange.end, label: period },

      // Revenue Metrics
      revenue: {
        total: totalRevenue,
        growth: revenueGrowth,
        byDay: revenueTimeSeriesData.slice(-30),
        byChannel: revenueByChannel,
        forecast: revenueForecast,
        avgDaily: avgDailyRevenue,
      },

      // Customer Metrics
      customers: {
        total: totalCustomers,
        new: newCustomersThisPeriod,
        returning: returningCustomers,
        distribution: { new: newCustomers, returning: returningCustomers },
        clv: averageCLV,
        rfmSegments: rfmSegments.slice(0, 100), // Top 100 for performance
        churnRate,
        retentionRate,
      },

      // Order Metrics
      orders: {
        total: totalOrders,
        growth: ordersGrowth,
        aov,
        aovGrowth,
        avgDeliveryTime,
        deliverySuccessRate,
        cancellationRate,
        cancellationReasons,
        refundRate,
      },

      // Product Metrics
      products: {
        top: topProducts,
        totalSKUs: Object.keys(productSales).length,
      },

      // Geographic Metrics
      geographic: geographicData.sort((a, b) => b.revenue - a.revenue).slice(0, 10),

      // Payment Metrics
      payments: paymentAnalytics,

      // Cohort Metrics
      cohorts: cohortRetention,
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    next(error);
  }
};

// ===== BUSINESS INTELLIGENCE INSIGHTS =====
export const getBusinessIntelligence = async (req, res, next) => {
  try {
    const { period = '90d', startDate, endDate } = req.query;
    const dateRange = getDateRange(period, startDate, endDate);

    // Fetch comprehensive order data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Previous period for growth calculation
    const periodDiff = dateRange.end - dateRange.start;
    const previousStart = new Date(dateRange.start.getTime() - periodDiff);
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStart,
          lt: dateRange.start,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // ===== 1. PRODUCT PORTFOLIO INTELLIGENCE =====

    // Calculate product metrics
    const productMetrics = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const pid = item.product?.id;
        if (pid) {
          if (!productMetrics[pid]) {
            productMetrics[pid] = {
              id: pid,
              name: item.product.name,
              category: item.product.category,
              currentRevenue: 0,
              previousRevenue: 0,
              currentQuantity: 0,
              currentOrders: 0,
            };
          }
          productMetrics[pid].currentRevenue += item.quantity * item.price;
          productMetrics[pid].currentQuantity += item.quantity;
          productMetrics[pid].currentOrders += 1;
        }
      });
    });

    previousOrders.forEach(order => {
      order.items.forEach(item => {
        const pid = item.product?.id;
        if (pid && productMetrics[pid]) {
          productMetrics[pid].previousRevenue += item.quantity * item.price;
        }
      });
    });

    // BCG Matrix Classification
    const totalRevenue = Object.values(productMetrics).reduce((sum, p) => sum + p.currentRevenue, 0);

    const bcgMatrix = Object.values(productMetrics).map(product => {
      const marketShare = totalRevenue > 0 ? (product.currentRevenue / totalRevenue) * 100 : 0;
      const growth = product.previousRevenue > 0
        ? ((product.currentRevenue - product.previousRevenue) / product.previousRevenue) * 100
        : 0;

      let category = 'dog';
      if (growth > 20 && marketShare > 5) category = 'star';
      else if (growth <= 20 && marketShare > 5) category = 'cashCow';
      else if (growth > 20 && marketShare <= 5) category = 'questionMark';

      return {
        id: product.id,
        name: product.name,
        marketShare,
        growth,
        category,
        revenue: product.currentRevenue,
      };
    });

    // ABC Classification (Pareto)
    const sortedProducts = Object.values(productMetrics)
      .sort((a, b) => b.currentRevenue - a.currentRevenue);

    let cumulativeRevenue = 0;
    const abcClassification = sortedProducts.map((product, index) => {
      cumulativeRevenue += product.currentRevenue;
      const cumulativePercentage = totalRevenue > 0 ? (cumulativeRevenue / totalRevenue) * 100 : 0;

      let classification = 'C';
      if (cumulativePercentage <= 80) classification = 'A';
      else if (cumulativePercentage <= 95) classification = 'B';

      return {
        id: product.id,
        name: product.name,
        revenue: product.currentRevenue,
        cumulativePercentage,
        classification,
        rank: index + 1,
      };
    });

    // ===== 2. PURCHASE PATTERNS =====

    // By day of week
    const byDayOfWeek = [0, 1, 2, 3, 4, 5, 6].map(day => ({
      day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day],
      orders: 0,
      revenue: 0,
    }));

    orders.forEach(order => {
      const day = new Date(order.createdAt).getDay();
      byDayOfWeek[day].orders += 1;
      byDayOfWeek[day].revenue += order.total;
    });

    // By month
    const byMonth = {};
    orders.forEach(order => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7);
      if (!byMonth[month]) {
        byMonth[month] = { orders: 0, revenue: 0 };
      }
      byMonth[month].orders += 1;
      byMonth[month].revenue += order.total;
    });

    const seasonalData = Object.entries(byMonth).map(([month, data]) => ({
      month,
      ...data,
    }));

    // ===== 3. CROSS-SELL INTELLIGENCE =====

    // Product co-occurrence matrix
    const coOccurrence = {};

    orders.forEach(order => {
      const productIds = order.items.map(item => item.product?.id).filter(Boolean);

      // For each pair of products in the order
      for (let i = 0; i < productIds.length; i++) {
        for (let j = i + 1; j < productIds.length; j++) {
          const key = `${productIds[i]}_${productIds[j]}`;
          coOccurrence[key] = (coOccurrence[key] || 0) + 1;
        }
      }
    });

    // Top bundles
    const topBundles = Object.entries(coOccurrence)
      .map(([key, count]) => {
        const [id1, id2] = key.split('_').map(Number);
        const product1 = productMetrics[id1];
        const product2 = productMetrics[id2];

        return {
          product1: product1?.name || 'Unknown',
          product2: product2?.name || 'Unknown',
          count,
          confidence: orders.length > 0 ? (count / orders.length) * 100 : 0,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ===== 4. CUSTOMER LIFECYCLE =====

    const customerOrders = {};
    orders.forEach(order => {
      if (order.userId) {
        if (!customerOrders[order.userId]) {
          customerOrders[order.userId] = [];
        }
        customerOrders[order.userId].push(order);
      }
    });

    const lifecycleStages = {
      new: 0,      // 1 order
      returning: 0, // 2-5 orders
      loyal: 0,     // 6-10 orders
      champion: 0,  // 11+ orders
    };

    Object.values(customerOrders).forEach(orders => {
      const count = orders.length;
      if (count === 1) lifecycleStages.new += 1;
      else if (count <= 5) lifecycleStages.returning += 1;
      else if (count <= 10) lifecycleStages.loyal += 1;
      else lifecycleStages.champion += 1;
    });

    // Time to second purchase
    const repurchaseTimes = [];
    Object.values(customerOrders).forEach(orders => {
      if (orders.length >= 2) {
        const sorted = orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const daysDiff = (new Date(sorted[1].createdAt) - new Date(sorted[0].createdAt)) / (1000 * 60 * 60 * 24);
        repurchaseTimes.push(daysDiff);
      }
    });

    const avgRepurchaseTime = repurchaseTimes.length > 0
      ? repurchaseTimes.reduce((sum, t) => sum + t, 0) / repurchaseTimes.length
      : 0;

    // ===== 5. CHANNEL INTELLIGENCE =====

    const channelMetrics = {};
    orders.forEach(order => {
      const channel = order.channel || 'unknown';
      if (!channelMetrics[channel]) {
        channelMetrics[channel] = {
          orders: 0,
          revenue: 0,
          customers: new Set(),
          avgOrderValue: 0,
        };
      }
      channelMetrics[channel].orders += 1;
      channelMetrics[channel].revenue += order.total;
      if (order.userId) {
        channelMetrics[channel].customers.add(order.userId);
      }
    });

    const channelIntelligence = Object.entries(channelMetrics).map(([channel, data]) => ({
      channel,
      orders: data.orders,
      revenue: data.revenue,
      uniqueCustomers: data.customers.size,
      aov: data.orders > 0 ? data.revenue / data.orders : 0,
      score: (data.revenue / 1000) + (data.customers.size * 10), // Simple scoring
    }));

    // ===== 6. PRICING INSIGHTS =====

    const withCoupon = orders.filter(o => o.couponCode);
    const withoutCoupon = orders.filter(o => !o.couponCode);

    const discountEffectiveness = {
      ordersWithCoupon: withCoupon.length,
      ordersWithoutCoupon: withoutCoupon.length,
      revenueWithCoupon: withCoupon.reduce((sum, o) => sum + o.total, 0),
      revenueWithoutCoupon: withoutCoupon.reduce((sum, o) => sum + o.total, 0),
      avgDiscountedAOV: withCoupon.length > 0
        ? withCoupon.reduce((sum, o) => sum + o.total, 0) / withCoupon.length
        : 0,
      avgRegularAOV: withoutCoupon.length > 0
        ? withoutCoupon.reduce((sum, o) => sum + o.total, 0) / withoutCoupon.length
        : 0,
      conversionLift: 0, // Would need traffic data
    };

    // ===== 7. PREDICTIVE ANALYTICS =====

    // Churn Risk (customers with no orders in last 60 days)
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const churnRisk = Object.entries(customerOrders)
      .map(([userId, orders]) => {
        const mostRecent = Math.max(...orders.map(o => new Date(o.createdAt).getTime()));
        const daysSinceLastOrder = (now - mostRecent) / (1000 * 60 * 60 * 24);
        const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

        let riskLevel = 'low';
        if (daysSinceLastOrder > 90) riskLevel = 'high';
        else if (daysSinceLastOrder > 60) riskLevel = 'medium';

        return {
          userId: parseInt(userId),
          daysSinceLastOrder: Math.floor(daysSinceLastOrder),
          totalOrders: orders.length,
          totalSpent,
          riskLevel,
        };
      })
      .filter(c => c.riskLevel !== 'low')
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 20);

    // Simple demand forecast (moving average)
    const dailyRevenue = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    });

    const revenueArray = Object.values(dailyRevenue);
    const avgDaily = revenueArray.length > 0
      ? revenueArray.reduce((sum, r) => sum + r, 0) / revenueArray.length
      : 0;

    const demandForecast = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      predicted: avgDaily,
      lower: avgDaily * 0.8,
      upper: avgDaily * 1.2,
    }));

    // ===== RESPONSE =====
    return res.json({
      period: { start: dateRange.start, end: dateRange.end },

      productPortfolio: {
        bcgMatrix,
        abcClassification: abcClassification.slice(0, 20),
        totalSKUs: Object.keys(productMetrics).length,
      },

      purchasePatterns: {
        byDayOfWeek,
        bySeason: seasonalData,
      },

      crossSell: {
        topBundles,
        totalPairs: Object.keys(coOccurrence).length,
      },

      customerJourney: {
        lifecycleStages,
        avgRepurchaseTime,
        totalCustomers: Object.keys(customerOrders).length,
      },

      channelIntelligence: channelIntelligence.sort((a, b) => b.score - a.score),

      pricingInsights: {
        discountEffectiveness,
        totalCouponsUsed: withCoupon.length,
      },

      predictive: {
        churnRisk,
        demandForecast,
      },
    });

  } catch (error) {
    console.error('BI Insights Error:', error);
    next(error);
  }
};
