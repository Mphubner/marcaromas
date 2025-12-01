import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    ArrowLeft,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    Calendar,
    Download
} from 'lucide-react';

const COLORS = ['#8B7355', '#6d5a42', '#a58b6f', '#5e4e3a', '#c9b18f'];

export default function ReferralAnalytics() {
    const navigate = useNavigate();
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Fetch overview stats
    const { data: stats } = useQuery({
        queryKey: ['admin-referral-stats'],
        queryFn: adminService.getReferralStats,
    });

    // Fetch top referrers
    const { data: topReferrers = [] } = useQuery({
        queryKey: ['top-referrers'],
        queryFn: () => adminService.getTopReferrers(10),
    });

    // Fetch revenue timeline
    const { data: timeline = [] } = useQuery({
        queryKey: ['revenue-timeline', dateFrom, dateTo],
        queryFn: () => adminService.getRevenueTimeline(dateFrom, dateTo),
    });

    // Calculate conversion by type for pie chart
    const conversionsByType = [
        { name: 'Cadastros', value: stats?.totalReferrals || 0 },
        { name: 'Conversões', value: stats?.completedReferrals || 0 },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const handleExport = () => {
        // TODO: Implement CSV export
        console.log('Export data:', { stats, topReferrers, timeline });
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin/referrals/programs')}
                        className="rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Analytics de Indicações</h2>
                        <p className="text-gray-500 mt-1">Performance do programa de referral</p>
                    </div>
                </div>

                <Button onClick={handleExport} variant="outline" className="rounded-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">Total Revenue</div>
                                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">Total Conversões</div>
                                <div className="text-2xl font-bold">{stats?.totalConversions || 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">CAC Médio</div>
                                <div className="text-2xl font-bold">{formatCurrency(stats?.averageCac)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">ROI</div>
                                <div className="text-2xl font-bold">{stats?.roi || 0}x</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Date Filter */}
            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Filtrar por Período
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="dateFrom">Data Início</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="rounded-lg mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="dateTo">Data Fim</Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="rounded-lg mt-1"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={() => {
                                    setDateFrom('');
                                    setDateTo('');
                                }}
                                variant="outline"
                                className="rounded-lg"
                            >
                                Limpar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Timeline Chart */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Revenue ao Longo do Tempo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timeline}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8B7355"
                                    strokeWidth={2}
                                    name="Revenue"
                                    dot={{ fill: '#8B7355' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rewards"
                                    stroke="#6d5a42"
                                    strokeWidth={2}
                                    name="Recompensas"
                                    dot={{ fill: '#6d5a42' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Conversions Pie Chart */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Conversões por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={conversionsByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {conversionsByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Referrers Table */}
            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle>Top 10 Indicadores</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Conversões</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ganhos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topReferrers.map((referrer, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-50 text-blue-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{referrer.user?.name || 'N/A'}</td>
                                        <td className="py-3 px-4 text-gray-600">{referrer.user?.email}</td>
                                        <td className="py-3 px-4 text-right font-semibold">{referrer.conversions}</td>
                                        <td className="py-3 px-4 text-right text-green-600 font-semibold">
                                            {formatCurrency(referrer.totalRevenue)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-[#8B7355] font-semibold">
                                            {formatCurrency(referrer.totalEarnings)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {topReferrers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum dado disponível ainda</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
