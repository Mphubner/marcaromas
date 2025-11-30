import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';
import { toast } from 'sonner';

/**
 * ImageUploadMultiple - Componente para upload de múltiplas imagens
 * Suporta drag & drop e seleção de arquivos
 * 
 * @param {string} label - Rótulo do campo
 * @param {string[]} images - Array de URLs das imagens
 * @param {function} onImagesChange - Callback para atualizar imagens
 * @param {number} maxImages - Número máximo de imagens
 * @param {number} maxSizeMB - Tamanho máximo por imagem em MB
 */
export default function ImageUploadMultiple({
    label = "Imagens",
    images = [],
    onImagesChange,
    maxImages = 5,
    maxSizeMB = 5
}) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (images.length + acceptedFiles.length > maxImages) {
            toast.error(`Você pode fazer upload de no máximo ${maxImages} imagens`);
            return;
        }

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of acceptedFiles) {
                // Validar tamanho
                if (file.size > maxSizeMB * 1024 * 1024) {
                    toast.error(`${file.name} excede o tamanho máximo de ${maxSizeMB}MB`);
                    continue;
                }

                // Upload da imagem
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const { data } = await api.post('/uploads', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    uploadedUrls.push(data.url);
                    toast.success(`${file.name} enviado com sucesso`);
                } catch (error) {
                    console.error('Erro ao fazer upload:', error);
                    toast.error(`Erro ao enviar ${file.name}`);
                }
            }

            if (uploadedUrls.length > 0) {
                onImagesChange([...images, ...uploadedUrls]);
            }
        } finally {
            setUploading(false);
        }
    }, [images, onImagesChange, maxImages, maxSizeMB]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        maxFiles: maxImages - images.length,
        disabled: uploading || images.length >= maxImages
    });

    const handleRemove = (index) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>

            {/* Dropzone */}
            {images.length < maxImages && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-[#8B7355] bg-[#8B7355]/5'
                        : 'border-gray-300 hover:border-[#8B7355] hover:bg-gray-50'
                        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    {uploading ? (
                        <p className="text-sm text-gray-600">Enviando imagens...</p>
                    ) : isDragActive ? (
                        <p className="text-sm text-[#8B7355] font-medium">Solte as imagens aqui</p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                                Arraste imagens ou clique para selecionar
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP até {maxSizeMB}MB • Máx {maxImages} imagens
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Grid de imagens */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                        >
                            <img
                                src={imageUrl}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem%3C/text%3E%3C/svg%3E';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-lg"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Remover
                                </Button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contador */}
            <p className="text-xs text-gray-500">
                {images.length} / {maxImages} imagens
            </p>
        </div>
    );
}
