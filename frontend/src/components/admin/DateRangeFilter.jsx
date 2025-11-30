import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const presets = [
    { label: 'Hoje', value: 'today' },
    { label: 'Ontem', value: 'yesterday' },
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Últimos 90 dias', value: '90d' },
    { label: 'Este Mês', value: 'this_month' },
    { label: 'Mês Passado', value: 'last_month' },
    { label: 'Este Ano', value: 'this_year' },
];

export function DateRangeFilter({ period, setPeriod, dateRange, setDateRange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStart, setTempStart] = useState('');
    const [tempEnd, setTempEnd] = useState('');

    // Initialize temp dates when opening custom range
    useEffect(() => {
        if (dateRange?.start && dateRange?.end) {
            setTempStart(dateRange.start.toISOString().split('T')[0]);
            setTempEnd(dateRange.end.toISOString().split('T')[0]);
        }
    }, [dateRange, isOpen]);

    const handlePresetChange = (value) => {
        setPeriod(value);
        setDateRange(null); // Clear custom range
        setIsOpen(false);
    };

    const handleCustomApply = () => {
        if (tempStart && tempEnd) {
            setPeriod('custom');
            setDateRange({
                start: new Date(tempStart),
                end: new Date(tempEnd)
            });
            setIsOpen(false);
        }
    };

    const getLabel = () => {
        if (period === 'custom' && dateRange?.start && dateRange?.end) {
            return `${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}`;
        }
        const preset = presets.find(p => p.value === period);
        return preset ? preset.label : 'Selecione o período';
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !period && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getLabel()}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                            <Button
                                key={preset.value}
                                variant={period === preset.value ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "justify-start font-normal",
                                    period === preset.value && "bg-[#8B7355] hover:bg-[#7A6548] text-white"
                                )}
                                onClick={() => handlePresetChange(preset.value)}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-medium text-sm mb-3">Intervalo Personalizado</h4>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Início</label>
                                <input
                                    type="date"
                                    value={tempStart}
                                    onChange={(e) => setTempStart(e.target.value)}
                                    className="w-full text-sm border rounded px-2 py-1"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Fim</label>
                                <input
                                    type="date"
                                    value={tempEnd}
                                    onChange={(e) => setTempEnd(e.target.value)}
                                    className="w-full text-sm border rounded px-2 py-1"
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full bg-[#8B7355] hover:bg-[#7A6548] text-white"
                            onClick={handleCustomApply}
                            disabled={!tempStart || !tempEnd}
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
