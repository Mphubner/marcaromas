import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardFilters } from "@/components/admin/DashboardFilters";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users,
  Activity, TrendingUp, TrendingDown, Package, CreditCard
} from "lucide-react";

const COLORS = {
  primary: '#8B7355',
  secondary: '#A89F91',
  tertiary: '#D4C5B0',
  accent: '#E5E5E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const STATUS_COLORS = {
  delivered: COLORS.success,
  shipped: '#3B82F6',
  processing: '#8B5CF6',
  paid: '#10B981',
  confirmed: '#06B6D4',
  pending: COLORS.warning,
  canceled: COLORS.error,
  refunded: '#F97316',
};

const periods = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
];

export default function OverviewDashboard() {
  const [period, setPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState(null);
  const [type, setType] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", period, type, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({ period, type });
      if (period === 'custom' && dateRange?.start && dateRange?.end) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }
      const { data } = await api.get(`/dashboard?${params.toString()}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
      </div>
    );
  }

  const GrowthIndicator = ({ value }) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center text-xs ${colorClass} mt-1`}>
        <Icon className="w-3 h-3 mr-1" />
        <span className="font-medium">{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
        <span className="text-gray-400 ml-1">vs. período anterior</span>
      </div>
    );
  };

  // Format status data for pie chart
  const statusData = Object.entries(data?.ordersByStatus || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fill: STATUS_COLORS[key] || COLORS.accent,
  }));

  // Format channel data for bar chart
  const channelData = Object.entries(data?.ordersByChannel || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h2>
          <p className="text-gray-500 mt-1">Visão geral do desempenho da loja</p>
        </div>
        <DashboardFilters
          period={period}
          setPeriod={setPeriod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          type={type}
          setType={setType}
        />
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-[#8B7355] to-[#6d5a43] text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {(data?.totalRevenue || 0).toLocaleString('pt-BR')}</div>
            <GrowthIndicator value={data?.revenueGrowth || 0} />
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#8B7355]" />
              Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data?.totalOrders || 0}</div>
            <GrowthIndicator value={data?.ordersGrowth || 0} />
          </CardContent>
        </Card>

        {/* AOV */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8B7355]" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">R$ {(data?.aov || 0).toFixed(0)}</div>
            <GrowthIndicator value={data?.aovGrowth || 0} />
          </CardContent>
        </Card>

        {/* MRR */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8B7355]" />
              MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">R$ {(data?.mrr || 0).toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-500 mt-1">
              {data?.totalActiveSubscriptions || 0} assinaturas ativas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Receita por Dia</CardTitle>
            <p className="text-sm text-gray-500">Últimos 7 dias</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueByDay || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `R$${value.toFixed(0)}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                  />
                  <Area type="monotone" dataKey="value" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Status dos Pedidos</CardTitle>
            <p className="text-sm text-gray-500">Distribuição atual</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channels */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Canais de Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Top 5 Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.topProducts || []).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.quantity} unidades</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    R$ {product.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Metrics */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Métricas Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Clientes</div>
              <div className="text-2xl font-bold text-gray-900">{data?.totalUsers || 0}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Itens Vendidos</div>
              <div className="text-2xl font-bold text-gray-900">{data?.totalItemsSold || 0}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Entregues</div>
              <div className="text-2xl font-bold text-green-700">{data?.deliveredOrders || 0}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600 mb-1">Cancelados</div>
              <div className="text-2xl font-bold text-red-700">{data?.canceledOrders || 0}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Taxa Reembolso</div>
              <div className="text-2xl font-bold text-orange-700">{(data?.refundRate || 0).toFixed(1)}%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Taxa Cancel.</div>
              <div className="text-2xl font-bold text-blue-700">{(data?.cancellationRate || 0).toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(data?.recentOrders || []).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</div>
                  <div className="text-sm text-gray-600">{order.customer}</div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'canceled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  R$ {order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
