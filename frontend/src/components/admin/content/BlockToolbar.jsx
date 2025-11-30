import React from 'react';
import {
    Type,
    Heading,
    Image,
    Video,
    Music,
    Images,
    Quote,
    Code,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BLOCK_TYPES = [
    { type: 'TEXT', icon: Type, label: 'Text', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { type: 'HEADING', icon: Heading, label: 'Heading', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { type: 'IMAGE', icon: Image, label: 'Image', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { type: 'YOUTUBE', icon: Video, label: 'YouTube', color: 'bg-red-50 hover:bg-red-100 text-red-700' },
    { type: 'SPOTIFY', icon: Music, label: 'Spotify', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
    { type: 'GALLERY', icon: Images, label: 'Gallery', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
    { type: 'QUOTE', icon: Quote, label: 'Quote', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
    { type: 'CODE', icon: Code, label: 'Code', color: 'bg-gray-50 hover:bg-gray-100 text-gray-700' },
    { type: 'DIVIDER', icon: Minus, label: 'Divider', color: 'bg-slate-50 hover:bg-slate-100 text-slate-700' }
];

export default function BlockToolbar({ onAddBlock }) {
    return (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-3">Add Block:</p>
            <div className="flex flex-wrap gap-2">
                {BLOCK_TYPES.map(({ type, icon: Icon, label, color }) => (
                    <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => onAddBlock(type)}
                        className={`${color} border-0`}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
