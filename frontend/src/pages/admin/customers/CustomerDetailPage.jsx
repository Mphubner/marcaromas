import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowLeft, Mail, Phone, Calendar, MapPin, CreditCard,
    Package, Crown, User, Edit, Ban, Check, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const { data: customer, isLoading } = useQuery({
        queryKey: ['customer', id],
        queryFn: () => adminService.getUserById(id),
    });

    const updateMutation = useMutation({
        mutationFn: (data) => adminService.updateUser(id, data),
        onSuccess: () => {
            toast.success('Cliente atualizado com sucesso!');
            queryClient.invalidateQueries(['customer', id]);
            setEditModalOpen(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao atualizar cliente');
        },
    });

    const handleEdit = () => {
        setFormData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            cpf: customer.cpf || '',
            birthdate: customer.birthdate ? customer.birthdate.split('T')[0] : '',
            address: {
                street: customer.address?.street || '',
                number: customer.address?.number || '',
                complement: customer.address?.complement || '',
                city: customer.address?.city || '',
                state: customer.address?.state || '',
                zip: customer.address?.zip || '',
            },
            notes: customer.notes || '',
        });
        setEditModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#8B7355]" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">Cliente não encontrado</h3>
                    <Button onClick={() => navigate('/admin/customers')} className="mt-4">
                        Voltar para Clientes
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const config = {
            active: { color: 'bg-green-100 text-green-800', label: 'Ativo', icon: Check },
            inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inativo', icon: User },
            blocked: { color: 'bg-red-100 text-red-800', label: 'Bloqueado', icon: Ban },
        };
        const { color, label, icon: Icon } = config[status] || config.active;
        return (
            <Badge className={`${color} rounded-lg`}>
                <Icon className="w-3 h-3 mr-1" />
                {label}
            </Badge>
        );
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/customers')}
                        className="rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{customer.name}</h2>
                        <p className="text-gray-500 mt-1">Cliente #{customer.id}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {getStatusBadge(customer.status)}
                    {customer.isAdmin && (
                        <Badge className="bg-purple-100 text-purple-800 rounded-lg">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Personal Info */}
                <div className="space-y-6">
                    <Card className="rounded-xl">
                        <CardHeader className="bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEdit}
                                    className="rounded-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-2xl font-bold">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold">{customer.name}</div>
                                    <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Email</div>
                                        <div className="text-sm">{customer.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Telefone</div>
                                        <div className="text-sm">
                                            {customer.phone || <span className="text-gray-400 italic">Não informado</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">CPF</div>
                                        <div className="text-sm">
                                            {customer.cpf || <span className="text-gray-400 italic">Não informado</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Data de Nascimento</div>
                                        <div className="text-sm">
                                            {customer.birthdate ? (
                                                new Date(customer.birthdate).toLocaleDateString()
                                            ) : (
                                                <span className="text-gray-400 italic">Não informado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Endereço</div>
                                        <div className="text-sm">
                                            {customer.address && typeof customer.address === 'object' && customer.address.street ? (
                                                <>
                                                    {customer.address.street}, {customer.address.number || 'S/N'}
                                                    {customer.address.complement && <><br />{customer.address.complement}</>}
                                                    {(customer.address.city || customer.address.state) && <br />}
                                                    {customer.address.city}{customer.address.state && ` - ${customer.address.state}`}
                                                    {customer.address.zip && <><br />CEP: {customer.address.zip}</>}
                                                </>
                                            ) : (
                                                <span className="text-gray-400 italic">Não informado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Cadastro</span>
                                    <span className="font-medium">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Stats */}
                <div className="space-y-6">
                    <Card className="rounded-xl">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Estatísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <div className="text-2xl font-bold text-blue-900">
                                        {customer.stats?.totalOrders || 0}
                                    </div>
                                    <div className="text-xs text-blue-600">Pedidos</div>
                                </div>

                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                    <div className="text-2xl font-bold text-green-900">
                                        R$ {(customer.stats?.totalSpent || 0).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-green-600">Gasto Total</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Ticket Médio</span>
                                    <span className="font-bold text-[#8B7355]">
                                        R$ {(customer.stats?.avgOrderValue || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 3: Activity */}
                <div className="space-y-6">
                    <Card className="rounded-xl">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg">Notas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-600">
                                {customer.notes || <span className="text-gray-400 italic">Nenhuma nota</span>}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Modal with dark background */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                < DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white">
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                        <DialogDescription>Atualize as informações do cliente</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Nome</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-lg mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="rounded-lg mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Telefone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                    className="rounded-lg mt-1.5"
                                />
                            </div>

                            <div>
                                <Label>CPF</Label>
                                <Input
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                    className="rounded-lg mt-1.5"
                                />
                            </div>

                            <div>
                                <Label>Data de Nascimento</Label>
                                <Input
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                    className="rounded-lg mt-1.5"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Endereço</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <Label>Rua</Label>
                                    <Input
                                        value={formData.address?.street}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, street: e.target.value }
                                        })}
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label>Número</Label>
                                    <Input
                                        value={formData.address?.number}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, number: e.target.value }
                                        })}
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Complemento</Label>
                                    <Input
                                        value={formData.address?.complement}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, complement: e.target.value }
                                        })}
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label>Cidade</Label>
                                    <Input
                                        value={formData.address?.city}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, city: e.target.value }
                                        })}
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label>Estado</Label>
                                    <Input
                                        value={formData.address?.state}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, state: e.target.value }
                                        })}
                                        placeholder="UF"
                                        maxLength={2}
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label>CEP</Label>
                                    <Input
                                        value={formData.address?.zip}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, zip: e.target.value }
                                        })}
                                        placeholder="00000-000"
                                        className="rounded-lg mt-1.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>Notas (Admin)</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Notas internas sobre o cliente"
                                rows={3}
                                className="rounded-lg mt-1.5"
                            />
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditModalOpen(false)}
                                className="rounded-lg"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
