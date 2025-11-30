import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

/**
 * ArrayInput - Componente reutilizável para gerenciar arrays de strings
 * Permite adicionar e remover itens de forma dinâmica
 * 
 * @param {string} label - Rótulo do campo
 * @param {string} placeholder - Placeholder para o input
 * @param {string[]} values - Array de valores atuais
 * @param {function} onChange - Callback para atualizar valores
 * @param {number} maxItems - Número máximo de itens (opcional)
 */
export default function ArrayInput({
    label,
    placeholder = "Digite um item...",
    values = [],
    onChange,
    maxItems = 20
}) {
    const [currentInput, setCurrentInput] = useState('');

    const handleAdd = () => {
        const trimmed = currentInput.trim();
        if (trimmed && values.length < maxItems) {
            onChange([...values, trimmed]);
            setCurrentInput('');
        }
    };

    const handleRemove = (index) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>

            {/* Input para adicionar novo item */}
            <div className="flex gap-2">
                <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 text-sm"
                />
                <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={!currentInput.trim() || values.length >= maxItems}
                    className="bg-[#8B7355] hover:bg-[#6B5845] text-white rounded-lg"
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Lista de itens adicionados */}
            {values.length > 0 && (
                <div className="space-y-2">
                    {values.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex-1 text-sm text-gray-700">{item}</div>
                            <Button
                                type="button"
                                onClick={() => handleRemove(index)}
                                variant="ghost"
                                size="sm"
                                className="opacity-60 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Contador de itens */}
            <p className="text-xs text-gray-500">
                {values.length} / {maxItems} itens
            </p>
        </div>
    );
}
