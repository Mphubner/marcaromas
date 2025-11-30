import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../../../lib/api';

export default function ImageUploadField({ value, onChange, label = "Image" }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/uploads/content-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onChange(response.data.meta.files.webp); // Use WebP version
            setPreview(response.data.meta.files.webp);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
            setPreview(value);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            {preview ? (
                <div className="relative">
                    <img
                        src={preview.startsWith('http') || preview.startsWith('/') ? preview : `http://localhost:5001${preview}`}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                            // Fallback if relative path fails (e.g. during preview of local file)
                            if (!preview.startsWith('data:')) {
                                e.target.src = `http://localhost:5001${preview}`;
                            }
                        }}
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]" />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
}
