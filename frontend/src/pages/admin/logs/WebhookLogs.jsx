import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Search, Filter, CheckCircle, XCircle, Activity } from 'lucide-react';
import api from '../../../lib/api';
import { Button } from '@/components/ui/button';
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

export default function WebhookLogs() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        status: 'ALL',
        provider: 'ALL',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['webhook-logs', page, filters],
        queryFn: async () => {
            const params = {
                page,
                limit: 20,
                ...(filters.status !== 'ALL' && { status: filters.status }),
                ...(filters.provider !== 'ALL' && { provider: filters.provider }),
            };
            const response = await api.get('/logs/webhooks', { params });
            return response.data;
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#8B7355]">Logs de Webhooks</h1>
                <p className="text-muted-foreground">
                    Histórico de eventos recebidos via webhook.
                </p>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Filtros:</span>
                </div>

                <Select
                    value={filters.status}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Status</SelectItem>
                        <SelectItem value="SUCCESS">Sucesso</SelectItem>
                        <SelectItem value="FAILED">Falha</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.provider}
                    onValueChange={(val) => setFilters(prev => ({ ...prev, provider: val }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Provedor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Provedores</SelectItem>
                        <SelectItem value="STRIPE">Stripe</SelectItem>
                        <SelectItem value="MERCADOPAGO">Mercado Pago</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[150px]">Provedor</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead className="w-[100px]">Payload</TableHead>
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
                                            {log.status === 'SUCCESS' ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-600">{log.provider}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.event}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm">Ver JSON</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Payload do Webhook</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    {log.error && (
                                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                            <h4 className="text-red-800 font-medium mb-1">Erro:</h4>
                                                            <p className="text-red-600 text-sm">{log.error}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-medium mb-2">Payload:</h4>
                                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                                                            {JSON.stringify(log.payload, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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
