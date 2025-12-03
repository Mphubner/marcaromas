import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    Star,
    Search,
    Home,
    Building,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientEmptyState,
    ClientBadge
} from '@/components/client';

// UI Components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

// Services
import { addressService } from '../services/addressService';
import { useAuth } from '../context/AuthContext';

export default function Addresses() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [cepLoading, setCepLoading] = useState(false);

    const [formData, setFormData] = useState({
        label: '',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isDefault: false
    });

    // Fetch addresses
    const { data: addresses = [], isLoading } = useQuery({
        queryKey: ['my-addresses'],
        queryFn: addressService.getMyAddresses,
        enabled: !!user
    });

    // Create/Update address mutation
    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editingAddress) {
                return addressService.update(editingAddress.id, data);
            }
            return addressService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-addresses']);
            toast.success(editingAddress ? 'Endereço atualizado!' : 'Endereço adicionado!');
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao salvar endereço');
        }
    });

    // Delete address mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => addressService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-addresses']);
            toast.success('Endereço removido!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao remover endereço');
        }
    });

    // Set default address mutation
    const setDefaultMutation = useMutation({
        mutationFn: (id) => addressService.setDefault(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-addresses']);
            toast.success('Endereço padrão atualizado!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Erro ao definir endereço padrão');
        }
    });

    // Fetch address from CEP using ViaCEP API
    const fetchAddressFromCEP = async (cep) => {
        const cleanCEP = cep.replace(/\D/g, '');

        if (cleanCEP.length !== 8) {
            toast.error('CEP deve ter 8 dígitos');
            return;
        }

        setCepLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error('CEP não encontrado');
                return;
            }

            setFormData(prev => ({
                ...prev,
                street: data.logradouro || '',
                neighborhood: data.bairro || '',
                city: data.localidade || '',
                state: data.uf || '',
                zipCode: cleanCEP
            }));

            toast.success('Endereço encontrado!');
        } catch (error) {
            toast.error('Erro ao buscar CEP');
        } finally {
            setCepLoading(false);
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                label: address.label || '',
                zipCode: address.zipCode || '',
                street: address.street || '',
                number: address.number || '',
                complement: address.complement || '',
                neighborhood: address.neighborhood || '',
                city: address.city || '',
                state: address.state || '',
                isDefault: address.isDefault || false
            });
        } else {
            setEditingAddress(null);
            setFormData({
                label: '',
                zipCode: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                isDefault: false
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingAddress(null);
        setFormData({
            label: '',
            zipCode: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            isDefault: false
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja remover este endereço?')) {
            deleteMutation.mutate(id);
        }
    };

    const formatCEP = (cep) => {
        const cleaned = cep.replace(/\D/g, '');
        if (cleaned.length <= 5) return cleaned;
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
    };

    const getAddressIcon = (label) => {
        const lowerLabel = label?.toLowerCase() || '';
        if (lowerLabel.includes('casa') || lowerLabel.includes('residência')) return Home;
        if (lowerLabel.includes('trabalho') || lowerLabel.includes('escritório')) return Building;
        return MapPin;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Meus Endereços"
                    subtitle="Gerencie seus endereços de entrega"
                    backTo="/dashboard"
                    action={
                        <ClientButton onClick={() => handleOpenModal()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Endereço
                        </ClientButton>
                    }
                />

                {addresses.length === 0 ? (
                    <ClientEmptyState
                        icon={MapPin}
                        title="Nenhum endereço cadastrado"
                        message="Adicione um endereço para facilitar suas compras futuras"
                        actionLabel="Adicionar Endereço"
                        onAction={() => handleOpenModal()}
                    />
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {addresses.map((address, index) => {
                            const Icon = getAddressIcon(address.label);

                            return (
                                <motion.div
                                    key={address.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ClientCard hoverable className="relative">
                                        {/* Default Badge */}
                                        {address.isDefault && (
                                            <div className="absolute top-4 right-4">
                                                <ClientBadge variant="active">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                    Padrão
                                                </ClientBadge>
                                            </div>
                                        )}

                                        {/* Address Info */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 rounded-2xl bg-[#8B7355]/10 flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-[#8B7355]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#2C2419]">
                                                        {address.label || 'Sem nome'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        CEP: {formatCEP(address.zipCode)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-gray-700">
                                                <p>
                                                    {address.street}, {address.number}
                                                </p>
                                                {address.complement && <p>{address.complement}</p>}
                                                <p>{address.neighborhood}</p>
                                                <p>
                                                    {address.city} - {address.state}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t">
                                            {!address.isDefault && (
                                                <ClientButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDefaultMutation.mutate(address.id)}
                                                    disabled={setDefaultMutation.isPending}
                                                >
                                                    <Star className="w-4 h-4 mr-2" />
                                                    Tornar Padrão
                                                </ClientButton>
                                            )}

                                            <ClientButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenModal(address)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </ClientButton>

                                            <ClientButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(address.id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Excluir
                                            </ClientButton>
                                        </div>
                                    </ClientCard>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Add/Edit Address Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-2xl rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                            </DialogTitle>
                            <p className="text-sm text-gray-600 mt-2">
                                {editingAddress ? 'Atualize as informações do endereço' : 'Preencha os dados do novo endereço de entrega'}
                            </p>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            {/* Label */}
                            <div>
                                <Label htmlFor="label">Nome do Endereço *</Label>
                                <Input
                                    id="label"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    placeholder="Ex: Casa, Trabalho, Apartamento"
                                    className="rounded-2xl mt-2"
                                    required
                                />
                            </div>

                            {/* CEP with Auto-complete */}
                            <div>
                                <Label htmlFor="zipCode">CEP *</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={(e) => {
                                            const formatted = formatCEP(e.target.value);
                                            setFormData(prev => ({ ...prev, zipCode: formatted }));
                                        }}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        className="rounded-2xl"
                                        required
                                    />
                                    <ClientButton
                                        type="button"
                                        variant="outline"
                                        onClick={() => fetchAddressFromCEP(formData.zipCode)}
                                        disabled={cepLoading}
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        {cepLoading ? 'Buscando...' : 'Buscar'}
                                    </ClientButton>
                                </div>
                            </div>

                            {/* Street and Number */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="street">Rua *</Label>
                                    <Input
                                        id="street"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        className="rounded-2xl mt-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="number">Número *</Label>
                                    <Input
                                        id="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        className="rounded-2xl mt-2"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Complement */}
                            <div>
                                <Label htmlFor="complement">Complemento</Label>
                                <Input
                                    id="complement"
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange}
                                    placeholder="Apto, bloco, etc"
                                    className="rounded-2xl mt-2"
                                />
                            </div>

                            {/* Neighborhood */}
                            <div>
                                <Label htmlFor="neighborhood">Bairro *</Label>
                                <Input
                                    id="neighborhood"
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="rounded-2xl mt-2"
                                    required
                                />
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">Cidade *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="rounded-2xl mt-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">Estado *</Label>
                                    <Select
                                        value={formData.state}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                                    >
                                        <SelectTrigger className="rounded-2xl mt-2">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AC">Acre</SelectItem>
                                            <SelectItem value="AL">Alagoas</SelectItem>
                                            <SelectItem value="AP">Amapá</SelectItem>
                                            <SelectItem value="AM">Amazonas</SelectItem>
                                            <SelectItem value="BA">Bahia</SelectItem>
                                            <SelectItem value="CE">Ceará</SelectItem>
                                            <SelectItem value="DF">Distrito Federal</SelectItem>
                                            <SelectItem value="ES">Espírito Santo</SelectItem>
                                            <SelectItem value="GO">Goiás</SelectItem>
                                            <SelectItem value="MA">Maranhão</SelectItem>
                                            <SelectItem value="MT">Mato Grosso</SelectItem>
                                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                            <SelectItem value="MG">Minas Gerais</SelectItem>
                                            <SelectItem value="PA">Pará</SelectItem>
                                            <SelectItem value="PB">Paraíba</SelectItem>
                                            <SelectItem value="PR">Paraná</SelectItem>
                                            <SelectItem value="PE">Pernambuco</SelectItem>
                                            <SelectItem value="PI">Piauí</SelectItem>
                                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                            <SelectItem value="RO">Rondônia</SelectItem>
                                            <SelectItem value="RR">Roraima</SelectItem>
                                            <SelectItem value="SC">Santa Catarina</SelectItem>
                                            <SelectItem value="SP">São Paulo</SelectItem>
                                            <SelectItem value="SE">Sergipe</SelectItem>
                                            <SelectItem value="TO">Tocantins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Set as Default */}
                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    className="w-4 h-4 text-[#8B7355] rounded"
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    Tornar este endereço padrão
                                </Label>
                            </div>
                        </form>

                        <DialogFooter>
                            <ClientButton variant="ghost" onClick={handleCloseModal} type="button">
                                Cancelar
                            </ClientButton>
                            <ClientButton
                                onClick={handleSubmit}
                                disabled={saveMutation.isPending}
                            >
                                {saveMutation.isPending
                                    ? 'Salvando...'
                                    : editingAddress
                                        ? 'Atualizar'
                                        : 'Adicionar'}
                            </ClientButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
