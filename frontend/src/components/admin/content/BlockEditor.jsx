import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploadField from './ImageUploadField';

export default function BlockEditor({ block, onChange, onDelete }) {
    const [data, setData] = useState(block.data || {});

    const updateData = (key, value) => {
        const newData = { ...data, [key]: value };
        setData(newData);
        onChange({ ...block, data: newData });
    };

    const updateArrayItem = (array, index, value) => {
        const newArray = [...array];
        newArray[index] = value;
        return newArray;
    };

    // Render editor based on block type
    const renderEditor = () => {
        switch (block.type) {
            case 'TEXT':
                return (
                    <div>
                        <Label>Content</Label>
                        <RichTextEditor
                            content={data.html || ''}
                            onChange={(html) => updateData('html', html)}
                        />
                        <div className="mt-2">
                            <Label>Alignment</Label>
                            <Select value={data.alignment || 'left'} onValueChange={(v) => updateData('alignment', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                    <SelectItem value="justify">Justify</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'HEADING':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Text</Label>
                            <Input
                                value={data.text || ''}
                                onChange={(e) => updateData('text', e.target.value)}
                                placeholder="Heading text"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Level</Label>
                                <Select value={String(data.level || 2)} onValueChange={(v) => updateData('level', parseInt(v))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">H1</SelectItem>
                                        <SelectItem value="2">H2</SelectItem>
                                        <SelectItem value="3">H3</SelectItem>
                                        <SelectItem value="4">H4</SelectItem>
                                        <SelectItem value="5">H5</SelectItem>
                                        <SelectItem value="6">H6</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Alignment</Label>
                                <Select value={data.alignment || 'left'} onValueChange={(v) => updateData('alignment', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                );

            case 'IMAGE':
                return (
                    <div className="space-y-3">
                        <div>
                            <ImageUploadField
                                value={data.url || ''}
                                onChange={(url) => updateData('url', url)}
                                label="Image"
                            />
                        </div>
                        <div>
                            <Label>Alt Text</Label>
                            <Input
                                value={data.alt || ''}
                                onChange={(e) => updateData('alt', e.target.value)}
                                placeholder="Image description"
                            />
                        </div>
                        <div>
                            <Label>Caption (optional)</Label>
                            <Input
                                value={data.caption || ''}
                                onChange={(e) => updateData('caption', e.target.value)}
                                placeholder="Image caption"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Width</Label>
                                <Select value={data.width || 'full'} onValueChange={(v) => updateData('width', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="full">Full</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Alignment</Label>
                                <Select value={data.alignment || 'center'} onValueChange={(v) => updateData('alignment', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                );

            case 'YOUTUBE':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Video ID</Label>
                            <Input
                                value={data.videoId || ''}
                                onChange={(e) => updateData('videoId', e.target.value)}
                                placeholder="dQw4w9WgXcQ"
                            />
                            <p className="text-xs text-gray-500 mt-1">From URL: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong></p>
                        </div>
                        <div>
                            <Label>Title (optional)</Label>
                            <Input
                                value={data.title || ''}
                                onChange={(e) => updateData('title', e.target.value)}
                                placeholder="Video title"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Start Time (seconds)</Label>
                                <Input
                                    type="number"
                                    value={data.startTime || 0}
                                    onChange={(e) => updateData('startTime', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.autoplay || false}
                                        onChange={(e) => updateData('autoplay', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Autoplay</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'SPOTIFY':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Spotify Type</Label>
                            <Select value={data.type || 'playlist'} onValueChange={(v) => updateData('type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="track">Track</SelectItem>
                                    <SelectItem value="playlist">Playlist</SelectItem>
                                    <SelectItem value="album">Album</SelectItem>
                                    <SelectItem value="artist">Artist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Spotify ID</Label>
                            <Input
                                value={data.id || ''}
                                onChange={(e) => updateData('id', e.target.value)}
                                placeholder="37i9dQZF1DXcBWIGoYBM5M"
                            />
                            <p className="text-xs text-gray-500 mt-1">From URL: open.spotify.com/{data.type || 'playlist'}/<strong>ID_HERE</strong></p>
                        </div>
                        <div>
                            <Label>Theme</Label>
                            <Select value={data.theme || 'light'} onValueChange={(v) => updateData('theme', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'GALLERY':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Layout</Label>
                            <Select value={data.layout || 'grid'} onValueChange={(v) => updateData('layout', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">Grid</SelectItem>
                                    <SelectItem value="carousel">Carousel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {data.layout === 'grid' && (
                            <div>
                                <Label>Columns</Label>
                                <Select value={String(data.columns || 3)} onValueChange={(v) => updateData('columns', parseInt(v))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div>
                            <Label>Images</Label>
                            {(data.images || []).map((img, index) => (
                                <div key={index} className="border rounded-lg p-3 mb-2 bg-gray-50">
                                    <Input
                                        value={img.url || ''}
                                        onChange={(e) => updateData('images', updateArrayItem(data.images, index, { ...img, url: e.target.value }))}
                                        placeholder="Image URL"
                                        className="mb-2"
                                    />
                                    <Input
                                        value={img.alt || ''}
                                        onChange={(e) => updateData('images', updateArrayItem(data.images, index, { ...img, alt: e.target.value }))}
                                        placeholder="Alt text"
                                        className="mb-2"
                                    />
                                    <Input
                                        value={img.caption || ''}
                                        onChange={(e) => updateData('images', updateArrayItem(data.images, index, { ...img, caption: e.target.value }))}
                                        placeholder="Caption (optional)"
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateData('images', data.images.filter((_, i) => i !== index))}
                                        className="mt-2 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateData('images', [...(data.images || []), { url: '', alt: '', caption: '' }])}
                                className="mt-2"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Image
                            </Button>
                        </div>
                    </div>
                );

            case 'QUOTE':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Quote Text</Label>
                            <textarea
                                value={data.text || ''}
                                onChange={(e) => updateData('text', e.target.value)}
                                placeholder="Enter quote..."
                                className="w-full p-3 border rounded-lg min-h-[100px]"
                            />
                        </div>
                        <div>
                            <Label>Author</Label>
                            <Input
                                value={data.author || ''}
                                onChange={(e) => updateData('author', e.target.value)}
                                placeholder="Author name"
                            />
                        </div>
                        <div>
                            <Label>Source (optional)</Label>
                            <Input
                                value={data.source || ''}
                                onChange={(e) => updateData('source', e.target.value)}
                                placeholder="Book, article, etc."
                            />
                        </div>
                        <div>
                            <Label>Style</Label>
                            <Select value={data.style || 'blockquote'} onValueChange={(v) => updateData('style', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blockquote">Blockquote</SelectItem>
                                    <SelectItem value="pullquote">Pullquote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 'CODE':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Code</Label>
                            <textarea
                                value={data.code || ''}
                                onChange={(e) => updateData('code', e.target.value)}
                                placeholder="Enter code..."
                                className="w-full p-3 border rounded-lg min-h-[150px] font-mono text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Language</Label>
                                <Input
                                    value={data.language || 'javascript'}
                                    onChange={(e) => updateData('language', e.target.value)}
                                    placeholder="javascript, python, etc."
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.showLineNumbers !== false}
                                        onChange={(e) => updateData('showLineNumbers', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Show line numbers</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'DIVIDER':
                return (
                    <div className="space-y-3">
                        <div>
                            <Label>Style</Label>
                            <Select value={data.style || 'solid'} onValueChange={(v) => updateData('style', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solid">Solid</SelectItem>
                                    <SelectItem value="dashed">Dashed</SelectItem>
                                    <SelectItem value="dotted">Dotted</SelectItem>
                                    <SelectItem value="decorative">Decorative (dots)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Spacing</Label>
                            <Select value={data.spacing || 'medium'} onValueChange={(v) => updateData('spacing', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            default:
                return <p className="text-sm text-gray-500">Unknown block type: {block.type}</p>;
        }
    };

    return (
        <div className="border-2 border-gray-200 rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#8B7355] text-white text-xs font-semibold rounded-full">
                        {block.type}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {renderEditor()}
        </div>
    );
}
