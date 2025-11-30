import React from 'react';
import { DateRangeFilter } from './DateRangeFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DashboardFilters({
    period,
    setPeriod,
    dateRange,
    setDateRange,
    type,
    setType
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap px-2">Visualizar:</span>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos (Total)</SelectItem>
                        <SelectItem value="orders">Vendas (Pedidos)</SelectItem>
                        <SelectItem value="subscriptions">Assinaturas (Recorrente)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap px-2">Período:</span>
                <DateRangeFilter
                    period={period}
                    setPeriod={setPeriod}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </div>
    );
}
