import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, Download, X } from "lucide-react";
import AnalyticsOverview from "./AnalyticsOverview";
import AnalyticsInsights from "./AnalyticsInsights";
import { DashboardFilters } from "@/components/admin/DashboardFilters";

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState(null);
  const [type, setType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [channel, setChannel] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Avançado</h2>
          <p className="text-gray-500 mt-1">
            {activeTab === 'overview'
              ? 'Análise detalhada de performance e comportamento'
              : 'Business Intelligence e Insights Preditivos'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <DashboardFilters
            period={period}
            setPeriod={setPeriod}
            dateRange={dateRange}
            setDateRange={setDateRange}
            type={type}
            setType={setType}
          />

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-[#8B7355] text-white' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          <Button className="bg-[#8B7355] hover:bg-[#7A6548] text-white">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Global Filters */}
      {showFilters && (
        <Card className="border-[#8B7355]">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Canal</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="website">Website</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="marketplace">Marketplace</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChannel('')}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
            Overview Analítico
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
            Business Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <AnalyticsOverview
            period={period}
            dateRange={dateRange}
            type={type}
            channel={channel}
          />
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <AnalyticsInsights
            period={period}
            dateRange={dateRange}
            type={type}
            channel={channel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
