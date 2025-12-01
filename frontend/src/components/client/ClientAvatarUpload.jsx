import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { ClientButton } from './ClientButton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Premium Avatar Upload Component
 * Circular avatar with upload overlay on hover
 */
export function ClientAvatarUpload({
    currentAvatar,
    onUpload,
    name = "User",
    size = "lg"
}) {
    const [preview, setPreview] = useState(currentAvatar);
    const [isHovering, setIsHovering] = useState(false);
    const fileInputRef = useRef(null);

    const sizes = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-40 h-40"
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onUpload?.(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <motion.div
                className={cn(
                    "relative rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer",
                    sizes[size]
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                {/* Avatar Image or Initials */}
                {preview ? (
                    <img
                        src={preview}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center text-white font-bold text-2xl">
                        {getInitials(name)}
                    </div>
                )}

                {/* Hover Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white"
                >
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-xs font-semibold">Alterar Foto</span>
                </motion.div>
            </motion.div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload Button (Mobile fallback) */}
            <ClientButton
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="md:hidden"
            >
                <Upload className="w-4 h-4 mr-2" />
                Alterar Foto
            </ClientButton>
        </div>
    );
}
