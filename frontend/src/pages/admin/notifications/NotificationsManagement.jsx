import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Send,
    Users,
    FileText,
    History,
    BarChart,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';
import { toast } from 'sonner';

export default function NotificationsManagement() {
    const [formData, setFormData] = useState({
        target: 'all',
        userId: '',
        type: 'SYSTEM',
        title: '',
        message: '',
        link: '',
        channels: ['IN_APP']
    });

    const sendMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/notifications/send', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(`Notificações enviadas: ${data.count}`);
            setFormData({ ...formData, title: '', message: '', link: '' });
        },
        onError: () => {
            toast.error('Erro ao enviar notificações');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error('Título e mensagem são obrigatórios');
            return;
        }
        sendMutation.mutate(formData);
    };

    const toggleChannel = (channel) => {
        setFormData(prev => {
            const channels = prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel];
            return { ...prev, channels };
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Notificações</h1>
                <p className="text-muted-foreground">
                    Envie notificações em massa, gerencie templates e visualize estatísticas.
                </p>
            </div>

            <Tabs defaultValue="send" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="send">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Nova Notificação</CardTitle>
                                <CardDescription>
                                    Preencha os dados para enviar uma notificação aos usuários.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Destinatário</Label>
                                            <Select
                                                value={formData.target}
                                                onValueChange={(val) => setFormData({ ...formData, target: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos os Usuários</SelectItem>
                                                    <SelectItem value="user">Usuário Específico</SelectItem>
                                                    <SelectItem value="segment">Segmento (Assinantes)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.target === 'user' && (
                                            <div className="space-y-2">
                                                <Label>ID do Usuário</Label>
                                                <Input
                                                    placeholder="ID do usuário"
                                                    value={formData.userId}
                                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Tipo</Label>
                                            <Select
                                                value={formData.type}
                                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SYSTEM">Sistema</SelectItem>
                                                    <SelectItem value="PROMOTION">Promoção</SelectItem>
                                                    <SelectItem value="CONTENT">Conteúdo</SelectItem>
                                                    <SelectItem value="ORDER">Pedido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Canais de Envio</Label>
                                        <div className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="ch_in_app"
                                                    checked={formData.channels.includes('IN_APP')}
                                                    onCheckedChange={() => toggleChannel('IN_APP')}
                                                />
                                                <Label htmlFor="ch_in_app">Plataforma</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="ch_email"
                                                    checked={formData.channels.includes('EMAIL')}
                                                    onCheckedChange={() => toggleChannel('EMAIL')}
                                                />
                                                <Label htmlFor="ch_email">Email</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Título</Label>
                                        <Input
                                            placeholder="Ex: Promoção de Natal"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Mensagem</Label>
                                        <Textarea
                                            placeholder="Digite sua mensagem aqui..."
                                            className="min-h-[100px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Link (Opcional)</Label>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={sendMutation.isPending}>
                                        {sendMutation.isPending ? (
                                            'Enviando...'
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" /> Enviar Notificação
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="col-span-3 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dicas de Engajamento</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-muted-foreground">
                                    <div className="flex gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                        <p>Use títulos curtos e diretos para aumentar a taxa de abertura.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                        <p>Segmente suas mensagens para evitar descadastros.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                        <p>Evite enviar muitas notificações no mesmo dia.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Estatísticas Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-[#8B7355]">98%</div>
                                            <div className="text-xs text-muted-foreground">Taxa de Entrega</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-[#8B7355]">45%</div>
                                            <div className="text-xs text-muted-foreground">Abertura (Email)</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Envios</CardTitle>
                            <CardDescription>
                                Visualize as últimas notificações enviadas pelo sistema.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <History className="w-12 h-12 mb-4 opacity-20" />
                                <p>O histórico de envios em massa será exibido aqui.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Templates de Notificação</CardTitle>
                            <CardDescription>
                                Gerencie modelos reutilizáveis para suas campanhas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <FileText className="w-12 h-12 mb-4 opacity-20" />
                                <p>Funcionalidade de templates em desenvolvimento.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
