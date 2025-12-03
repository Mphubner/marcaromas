import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Search, Filter, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import api from '../../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const MODULES = {
    AUTH: 'AUTH',
    ORDER: 'ORDER',
    PAYMENT: 'PAYMENT',
    SYSTEM: 'SYSTEM',
    WEBHOOK: 'WEBHOOK',
    NOTIFICATION: 'NOTIFICATION',
};

export default function SystemLogs() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        level: 'ALL',
        module: 'ALL',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['system-logs', page, filters],
        queryFn: async () => {
            const params = {
                page,
                limit: 20,
                ...(filters.level !== 'ALL' && { level: filters.level }),
                ...(filters.module !== 'ALL' && { module: filters.module }),
            };
            const response = await api.get('/logs/system', { params });
            return response.data;
        },
    });

    const getLevelIcon = (level) => {
        switch (level) {
            case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#8B7355]">Logs do Sistema</h1>
                <p className="text-muted-foreground">
                    Monitoramento de eventos e erros do sistema.
                </p>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Filtros:</span>
                </div>

                <Select
                    value={filters.level}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, level: val }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Níveis</SelectItem>
                        {Object.keys(LOG_LEVELS).map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.module}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, module: val }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Módulo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Módulos</SelectItem>
                        {Object.keys(MODULES).map(mod => (
                            <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Nível</TableHead>
                            <TableHead className="w-[150px]">Módulo</TableHead>
                            <TableHead>Mensagem</TableHead>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead className="w-[100px]">Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Carregando logs...
                                </TableCell>
                            </TableRow>
                        ) : data?.logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Nenhum log encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getLevelIcon(log.level)}
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                                                    log.level === 'WARN' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {log.level}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-600">{log.module}</TableCell>
                                    <TableCell className="max-w-md truncate" title={log.message}>
                                        {log.message}
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell>
                                        {log.metadata && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">Ver JSON</Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes do Log</DialogTitle>
                                                    </DialogHeader>
                                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </pre>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {data?.pagination && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Página {data.pagination.currentPage} de {data.pagination.pages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= data.pagination.pages}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
