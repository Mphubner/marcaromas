import { prisma } from '../lib/prisma.js';

// Helper para calcular date range baseado no período
const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return { start: today, end: now };
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: today };
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
      // Default: last 30 days
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 30);
      return { start: defaultStart, end: now };
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const user = req.user;
    const { period = '30d', startDate, endDate, type = 'all' } = req.query;

    // Calculate date range
    let dateRange;
    if (startDate && endDate) {
      dateRange = { start: new Date(startDate), end: new Date(endDate) };
    } else {
      dateRange = getDateRange(period);
    }

    // Admin dashboard
    if (user.isAdmin) {
      // Fetch orders within period
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
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch active subscriptions
      const activeSubscriptions = await prisma.subscription.findMany({
        where: { status: 'active' },
        include: { plan: true },
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

      // ==== CALCULATE METRICS ====

      // Revenue Calculation
      const ordersRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Estimate subscription revenue based on active subscriptions and period duration
      // This is a simplified estimation. In a real scenario, you'd track invoices/transactions.
      // For this seed data, we'll use new subscriptions + recurring estimate
      const subscriptionsRevenue = newSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);

      let totalRevenue = 0;
      if (type === 'orders') {
        totalRevenue = ordersRevenue;
      } else if (type === 'subscriptions') {
        totalRevenue = subscriptionsRevenue;
      } else {
        totalRevenue = ordersRevenue + subscriptionsRevenue;
      }

      // Previous period for comparison (Simplified for now)
      const revenueGrowth = 0; // To be implemented with full history tracking

      // Monthly Recurring Revenue (MRR) - Only relevant for subscriptions
      const mrr = activeSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);

      // Total Orders and AOV
      const totalOrders = orders.length;
      const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const ordersGrowth = 0; // Simplified for now
      const aovGrowth = 0; // Simplified for now


      // Orders by Status
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Orders by Channel
      const ordersByChannel = orders.reduce((acc, order) => {
        acc[order.channel] = (acc[order.channel] || 0) + 1;
        return acc;
      }, {});

      // Orders by Payment Method
      const ordersByPayment = orders.reduce((acc, order) => {
        if (order.paymentMethod) {
          acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
        }
        return acc;
      }, {});

      // Revenue by Day
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

      const revenueChartData = Object.entries(revenueByDay)
        .map(([day, revenue]) => ({ name: day, value: revenue }))
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.name.split('/').map(Number);
          const [dayB, monthB, yearB] = b.name.split('/').map(Number);
          return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
        })
        .slice(-7); // Last 7 days (or adjust based on period)

      // Top Products (Only for orders)
      const productSales = {};
      if (type !== 'subscriptions') {
        orders.forEach(order => {
          order.items.forEach(item => {
            const productId = item.product?.id;
            if (productId) {
              if (!productSales[productId]) {
                productSales[productId] = {
                  id: productId,
                  name: item.product.name,
                  quantity: 0,
                  revenue: 0,
                };
              }
              productSales[productId].quantity += item.quantity;
              productSales[productId].revenue += item.quantity * item.price;
            }
          });
        });
      }

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Recent Orders (last 5)
      const recentOrders = orders.slice(0, 5).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user?.name || 'Guest',
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      }));

      // Customers count
      const totalUsers = await prisma.user.count();

      // Calculate additional metrics
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const canceledOrders = orders.filter(o => o.status === 'canceled').length;
      const refundedOrders = orders.filter(o => o.status === 'refunded').length;

      const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0;
      const cancellationRate = totalOrders > 0 ? (canceledOrders / totalOrders) * 100 : 0;

      // Total items sold
      const totalItemsSold = orders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      return res.json({
        // Period Info
        period: {
          start: dateRange.start,
          end: dateRange.end,
          label: period,
        },

        // Main KPIs
        totalRevenue,
        revenueGrowth,
        totalOrders,
        ordersGrowth,
        aov,
        aovGrowth,
        mrr,

        // Subscriptions
        totalActiveSubscriptions: activeSubscriptions.length,

        // Customers
        totalUsers,

        // Additional Metrics
        deliveredOrders,
        canceledOrders,
        refundedOrders,
        refundRate,
        cancellationRate,
        totalItemsSold,

        // Breakdowns
        ordersByStatus,
        ordersByChannel,
        ordersByPayment,

        // Charts Data
        revenueByDay: revenueChartData,
        topProducts,
        recentOrders,

        // User info
        user: {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    }

    // Regular user dashboard (simplified)
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: { plan: true },
    });

    return res.json({
      orders: userOrders,
      subscriptions: userSubscriptions,
      user: {
        name: user.name,
        email: user.email,
        total_credits: user.total_credits,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    next(error);
  }
};
