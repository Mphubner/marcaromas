// Separamos o componente Overview anterior
// Este é o mesmo conteúdo anterior mas agora recebe period e channel como props

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag,
    Activity, Package, CreditCard
} from "lucide-react";

const COLORS = {
    primary: '#8B7355',
    secondary: '#A89F91',
    tertiary: '#D4C5B0',
    accent: '#E5E5E5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
};

const CHART_COLORS = [COLORS.primary, COLORS.info, COLORS.success, COLORS.warning, COLORS.error, COLORS.purple];
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

export default function AnalyticsOverview({ period, channel, dateRange, type }) {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics", period, channel, dateRange, type],
        queryFn: async () => {
            const params = new URLSearchParams({ period });
            if (channel) params.append('channel', channel);
            if (type) params.append('type', type);
            if (period === 'custom' && dateRange?.start && dateRange?.end) {
                params.append('startDate', dateRange.start.toISOString());
                params.append('endDate', dateRange.end.toISOString());
            }
            const { data } = await api.get(`/analytics?${params}`);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
            </div>
        );
    }

    const GrowthBadge = ({ value }) => {
        const isPositive = value >= 0;
        const Icon = isPositive ? TrendingUp : TrendingDown;
        return (
            <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                <Icon className="w-3 h-3" />
                <span className="font-medium">{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
            </div>
        );
    };

    const channelChartData = Object.entries(data?.revenue?.byChannel || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    const customerDistData = [
        { name: 'Novos', value: data?.customers?.distribution?.new || 0, fill: COLORS.info },
        { name: 'Recorrentes', value: data?.customers?.distribution?.returning || 0, fill: COLORS.success },
    ];

    const statusData = Object.entries(data?.ordersByStatus || {}).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        fill: STATUS_COLORS[key] || COLORS.accent,
    }));

    return (
        <div className="space-y-6">
            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <GrowthBadge value={data?.revenue?.growth || 0} />
                        </div>
                        <div className="text-sm text-gray-500">Receita Total</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            R$ {(data?.revenue?.total || 0).toLocaleString('pt-BR')}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">CLV Médio</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            R$ {(data?.customers?.clv || 0).toFixed(0)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Taxa de Retenção</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {(data?.customers?.retentionRate || 0).toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Taxa de Churn</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {(data?.customers?.churnRate || 0).toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-orange-600" />
                            </div>
                            <GrowthBadge value={data?.orders?.aovGrowth || 0} />
                        </div>
                        <div className="text-sm text-gray-500">AOV</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            R$ {(data?.orders?.aov || 0).toFixed(0)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <Package className="w-5 h-5 text-teal-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Entregas no Prazo</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {(data?.orders?.deliverySuccessRate || 0).toFixed(0)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Continue... (Reusing existing code from previous AnalyticsDashboard) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Receita ao Longo do Tempo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.revenue?.byDay || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v.toFixed(0)}`} />
                                    <Tooltip formatter={(v) => [`R$ ${v.toFixed(2)}`, 'Receita']} />
                                    <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={customerDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                        {customerDistData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* More charts... (continuing with RFM, Channel, Products, etc - reuse existing code) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Segmentação RFM</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="recency" name="Recency" tick={{ fontSize: 11 }} />
                                    <YAxis dataKey="monetary" name="Monetary" tick={{ fontSize: 11 }} />
                                    <ZAxis dataKey="frequency" range={[50, 400]} />
                                    <Tooltip />
                                    <Scatter data={(data?.customers?.rfmSegments || []).slice(0, 50)} fill={COLORS.primary} fillOpacity={0.6} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Receita por Canal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={channelChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v.toFixed(0)}`} />
                                    <Tooltip formatter={(v) => [`R$ ${v.toFixed(2)}`, 'Receita']} />
                                    <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products, Geographic, Payments, Cohort - reuse existing code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {(data?.products?.top || []).map((product, index) => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#8B7355] text-white flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.quantity} unidades</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm">R$ {product.revenue.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição Geográfica</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.geographic || []} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis dataKey="state" type="category" width={50} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill={COLORS.info} radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
