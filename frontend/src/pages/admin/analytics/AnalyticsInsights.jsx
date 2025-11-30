import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, Legend,
    AreaChart, Area, ZAxis
} from 'recharts';
import {
    TrendingUp, Package, Users, DollarSign, Target, AlertTriangle,
    Star, Trophy, Lightbulb
} from "lucide-react";

const COLORS = {
    primary: '#8B7355',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
};

const BCG_COLORS = {
    star: COLORS.success,
    cashCow: COLORS.info,
    questionMark: COLORS.warning,
    dog: COLORS.error,
};

export default function AnalyticsInsights({ period, channel, dateRange, type }) {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics-insights", period, channel, dateRange, type],
        queryFn: async () => {
            const params = new URLSearchParams({ period });
            if (channel) params.append('channel', channel);
            if (type) params.append('type', type);
            if (period === 'custom' && dateRange?.start && dateRange?.end) {
                params.append('startDate', dateRange.start.toISOString());
                params.append('endDate', dateRange.end.toISOString());
            }
            const { data } = await api.get(`/analytics/insights?${params}`);
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

    // ===== BCG Matrix Data =====
    const bcgData = (data?.productPortfolio?.bcgMatrix || []).map(p => ({
        x: p.marketShare,
        y: p.growth,
        z: p.revenue,
        name: p.name,
        category: p.category,
    }));

    // ===== ABC Classification Data =====
    const abcData = data?.productPortfolio?.abcClassification || [];

    // ===== Purchase Patterns =====
    const dayOfWeekData = data?.purchasePatterns?.byDayOfWeek || [];
    const seasonalData = data?.purchasePatterns?.bySeason || [];

    // ===== Lifecycle Stages =====
    const lifecycleData = Object.entries(data?.customerJourney?.lifecycleStages || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-6 h-6 text-purple-600" />
                            <div className="text-sm font-medium text-purple-900">Total SKUs</div>
                        </div>
                        <div className="text-3xl font-bold text-purple-900">
                            {data?.productPortfolio?.totalSKUs || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            <div className="text-sm font-medium text-blue-900">Total Clientes</div>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">
                            {data?.customerJourney?.totalCustomers || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-6 h-6 text-green-600" />
                            <div className="text-sm font-medium text-green-900">Bundles Identificados</div>
                        </div>
                        <div className="text-3xl font-bold text-green-900">
                            {data?.crossSell?.totalPairs || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                            <div className="text-sm font-medium text-orange-900">Clientes em Risco</div>
                        </div>
                        <div className="text-3xl font-bold text-orange-900">
                            {(data?.predictive?.churnRisk || []).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* BCG Matrix */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#8B7355]" />
                        Matriz BCG - Portfólio de Produtos
                    </CardTitle>
                    <p className="text-sm text-gray-500">Classificação estratégica: Stars, Cash Cows, Question Marks, Dogs</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="x"
                                    name="Market Share (%)"
                                    label={{ value: 'Market Share (%)', position: 'bottom' }}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis
                                    dataKey="y"
                                    name="Growth (%)"
                                    label={{ value: 'Growth (%)', angle: -90, position: 'left' }}
                                    tick={{ fontSize: 11 }}
                                />
                                <ZAxis dataKey="z" range={[100, 1000]} name="Revenue" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Products" data={bcgData} fill={COLORS.primary}>
                                    {bcgData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BCG_COLORS[entry.category] || COLORS.primary} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-xs font-medium">Stars</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium">Cash Cows</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-xs font-medium">Question Marks</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs font-medium">Dogs</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ABC Classification + Purchase Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ABC Curve */}
                <Card>
                    <CardHeader>
                        <CardTitle>Curva ABC (Pareto)</CardTitle>
                        <p className="text-sm text-gray-500">80% da receita vem de 20% dos produtos</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={abcData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rank" label={{ value: 'Rank', position: 'bottom' }} tick={{ fontSize: 11 }} />
                                    <YAxis label={{ value: '% Acumulado', angle: -90, position: 'left' }} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="cumulativePercentage" stroke={COLORS.primary} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Purchase by Day of Week */}
                <Card>
                    <CardHeader>
                        <CardTitle>Padrão de Compra por Dia</CardTitle>
                        <p className="text-sm text-gray-500">Melhores dias para vendas</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dayOfWeekData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill={COLORS.info} radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cross-Sell Opportunities + Channel Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Bundles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-[#8B7355]" />
                            Top 10 Oportunidades de Cross-Sell
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {(data?.crossSell?.topBundles || []).map((bundle, index) => (
                                <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-transparent border border-purple-100 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-900">{bundle.product1}</div>
                                            <div className="text-xs text-gray-600">+ {bundle.product2}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-purple-600">{bundle.count}×</div>
                                            <div className="text-xs text-gray-500">{bundle.confidence.toFixed(1)}% confiança</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Channel Intelligence */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inteligência de Canal</CardTitle>
                        <p className="text-sm text-gray-500">Performance e scoring por canal</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(data?.channelIntelligence || []).map((ch, index) => (
                                <div key={ch.channel} className="border-b border-gray-100 pb-3 last:border-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-gray-900 capitalize">{ch.channel}</span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                            Score: {ch.score.toFixed(0)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-gray-500">Pedidos</div>
                                            <div className="font-semibold">{ch.orders}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Receita</div>
                                            <div className="font-semibold">R$ {ch.revenue.toFixed(0)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">AOV</div>
                                            <div className="font-semibold">R$ {ch.aov.toFixed(0)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customer Lifecycle + Demand Forecast */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lifecycle Stages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estágios de Ciclo de Vida</CardTitle>
                        <p className="text-sm text-gray-500">Distribuição de clientes por maturidade</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={lifecycleData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill={COLORS.primary}
                                        dataKey="value"
                                        label
                                    >
                                        {lifecycleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={[COLORS.info, COLORS.success, COLORS.warning, COLORS.primary][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-600">
                            Tempo médio até 2ª compra: <span className="font-bold">{(data?.customerJourney?.avgRepurchaseTime || 0).toFixed(0)} dias</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Demand Forecast */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-[#8B7355]" />
                            Previsão de Demanda (30 dias)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.predictive?.demandForecast || []}>
                                    <defs>
                                        <linearGradient id="predicted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={COLORS.info} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v.toFixed(0)}`} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="upper" stroke="transparent" fill="#E0E7FF" />
                                    <Area type="monotone" dataKey="predicted" stroke={COLORS.info} strokeWidth={2} fill="url(#predicted)" />
                                    <Area type="monotone" dataKey="lower" stroke="transparent" fill="#ffffff" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Churn Risk Table + Pricing Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Churn Risk */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Clientes em Risco de Churn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {(data?.predictive?.churnRisk || []).slice(0, 10).map((customer) => (
                                <div key={customer.userId} className={`p-3 rounded-lg border ${customer.riskLevel === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm font-semibold">Cliente #{customer.userId}</div>
                                            <div className="text-xs text-gray-600">{customer.daysSinceLastOrder} dias desde última compra</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">R$ {customer.totalSpent.toFixed(2)}</div>
                                            <div className={`text-xs font-medium ${customer.riskLevel === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {customer.riskLevel.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Insights de Pricing</CardTitle>
                        <p className="text-sm text-gray-500">Efetividade de cupons e descontos</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Com Cupom</div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {data?.pricingInsights?.discountEffectiveness?.ordersWithCoupon || 0}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        AOV: R$ {(data?.pricingInsights?.discountEffectiveness?.avgDiscountedAOV || 0).toFixed(2)}
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Sem Cupom</div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        {data?.pricingInsights?.discountEffectiveness?.ordersWithoutCoupon || 0}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        AOV: R$ {(data?.pricingInsights?.discountEffectiveness?.avgRegularAOV || 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-2">Total de Cupons Usados</div>
                                <div className="text-3xl font-bold text-purple-700">
                                    {data?.pricingInsights?.totalCouponsUsed || 0}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
