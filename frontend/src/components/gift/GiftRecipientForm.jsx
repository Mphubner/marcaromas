import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Home, Hash, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GiftRecipientForm({ formData, onChange, errors = {} }) {
    const personalFields = [
        {
            name: 'recipientName',
            label: 'Nome completo',
            type: 'text',
            icon: User,
            placeholder: 'Maria Santos',
            fullWidth: true
        },
        {
            name: 'recipientEmail',
            label: 'E-mail',
            type: 'email',
            icon: Mail,
            placeholder: 'maria@email.com',
            helper: 'Enviaremos uma notificação sobre o presente'
        },
        {
            name: 'recipientPhone',
            label: 'Telefone',
            type: 'tel',
            icon: Phone,
            placeholder: '(11) 99999-9999',
            helper: 'Para contato da transportadora'
        }
    ];

    const addressFields = [
        {
            name: 'recipientZipCode',
            label: 'CEP',
            type: 'text',
            icon: MapPin,
            placeholder: '00000-000',
            span: 1
        },
        {
            name: 'recipientStreet',
            label: 'Rua/Avenida',
            type: 'text',
            icon: Map,
            placeholder: 'Rua das Flores',
            span: 2
        },
        {
            name: 'recipientNumber',
            label: 'Número',
            type: 'text',
            icon: Hash,
            placeholder: '123',
            span: 1
        },
        {
            name: 'recipientComplement',
            label: 'Complemento',
            type: 'text',
            icon: Home,
            placeholder: 'Apto 45 (opcional)',
            span: 2,
            required: false
        },
        {
            name: 'recipientNeighborhood',
            label: 'Bairro',
            type: 'text',
            icon: Map,
            placeholder: 'Centro',
            span: 1
        },
        {
            name: 'recipientCity',
            label: 'Cidade',
            type: 'text',
            icon: Map,
            placeholder: 'São Paulo',
            span: 1
        },
        {
            name: 'recipientState',
            label: 'Estado',
            type: 'text',
            icon: Map,
            placeholder: 'SP',
            span: 1
        }
    ];

    return (
        <div className="py-16 bg-gradient-to-br from-white to-[#FAFAF9]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Para quem é o presente?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Informe os dados de quem irá receber este presente especial
                </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-[#2C2419] mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#8B7355]" />
                        Informações Pessoais
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {personalFields.map((field, index) => {
                            const Icon = field.icon;
                            return (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={field.fullWidth ? 'md:col-span-2' : ''}
                                >
                                    <Label htmlFor={field.name} className="text-sm font-semibold text-[#2C2419] mb-2 flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-[#8B7355]" />
                                        {field.label}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={onChange}
                                        placeholder={field.placeholder}
                                        className={`mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {field.helper && (
                                        <p className="text-xs text-gray-500 mt-1">{field.helper}</p>
                                    )}
                                    {errors[field.name] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-[#2C2419] mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#8B7355]" />
                        Endereço de Entrega
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                        {addressFields.map((field, index) => {
                            const Icon = field.icon;
                            return (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    className={`col-span-3 md:col-span-${field.span || 1}`}
                                >
                                    <Label htmlFor={field.name} className="text-sm font-semibold text-[#2C2419] mb-2 flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-[#8B7355]" />
                                        {field.label}
                                        {field.required !== false && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={onChange}
                                        placeholder={field.placeholder}
                                        className={`mt-1 ${errors[field.name] ? 'border-red-500' : ''}`}
                                        required={field.required !== false}
                                    />
                                    {field.helper && (
                                        <p className="text-xs text-gray-500 mt-1">{field.helper}</p>
                                    )}
                                    {errors[field.name] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
