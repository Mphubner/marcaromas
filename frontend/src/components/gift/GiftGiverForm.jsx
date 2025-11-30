import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GiftGiverForm({ formData, onChange, errors = {} }) {
    const fields = [
        {
            name: 'giverName',
            label: 'Seu nome completo',
            type: 'text',
            icon: User,
            placeholder: 'João Silva'
        },
        {
            name: 'giverEmail',
            label: 'Seu e-mail',
            type: 'email',
            icon: Mail,
            placeholder: 'joao@email.com'
        },
        {
            name: 'giverPhone',
            label: 'Seu telefone',
            type: 'tel',
            icon: Phone,
            placeholder: '(11) 99999-9999'
        },
        {
            name: 'giverCPF',
            label: 'Seu CPF',
            type: 'text',
            icon: CreditCard,
            placeholder: '000.000.000-00',
            helper: 'Necessário para emissão da nota fiscal'
        }
    ];

    return (
        <div className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4">
                    Seus dados
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Precisamos de algumas informações suas para finalizar o presente
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    {fields.map((field, index) => {
                        const Icon = field.icon;
                        return (
                            <motion.div
                                key={field.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={field.name === 'giverName' || field.name === 'giverEmail' ? 'md:col-span-2' : ''}
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
        </div>
    );
}
