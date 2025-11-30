import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BlockToolbar from './BlockToolbar';
import BlockEditor from './BlockEditor';
import { contentTemplates, getTemplate } from './ContentTemplates';

const CATEGORIES = [
    { value: 'aromatherapy', label: 'Aromaterapia' },
    { value: 'self_care', label: 'Autocuidado' },
    { value: 'wellness', label: 'Bem-estar' },
    { value: 'behind_scenes', label: 'Bastidores' }
];

const CONTENT_TYPES = [
    { value: 'BLOG_POST', label: 'Blog Post' },
    { value: 'EXCLUSIVE_CONTENT', label: 'Exclusive Content' }
];

// Default data for each block type
const getDefaultBlockData = (type) => {
    const defaults = {
        TEXT: { html: '<p>Enter text here...</p>', alignment: 'left' },
        HEADING: { text: 'Heading', level: 2, alignment: 'left' },
        IMAGE: { url: '', alt: '', caption: '', width: 'full', alignment: 'center' },
        YOUTUBE: { videoId: '', title: '', startTime: 0, autoplay: false },
        SPOTIFY: { type: 'playlist', id: '', theme: 'light' },
        GALLERY: { images: [], layout: 'grid', columns: 3 },
        QUOTE: { text: '', author: '', source: '', style: 'blockquote' },
        CODE: { code: '', language: 'javascript', showLineNumbers: true },
        DIVIDER: { style: 'solid', spacing: 'medium' }
    };
    return defaults[type] || {};
};

export default function ContentEditor({ initialContent, onSave, onCancel }) {
    const [content, setContent] = useState(initialContent || {
        title: '',
        excerpt: '',
        cover_image: '',
        type: 'BLOG_POST',
        category: 'aromatherapy',
        tags: [],
        required_plan_ids: [],
        seo_title: '',
        seo_description: '',
        seo_keywords: [],
        blocks: []
    });

    const [tagInput, setTagInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');

    const updateField = (field, value) => {
        setContent(prev => ({ ...prev, [field]: value }));
    };

    const handleAddBlock = (type) => {
        const newBlock = {
            id: `temp_${Date.now()}`,
            type,
            data: getDefaultBlockData(type),
            order: content.blocks.length,
            is_visible: true
        };
        setContent(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock]
        }));
    };

    const handleUpdateBlock = (blockId, updatedBlock) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === blockId ? updatedBlock : b)
        }));
    };

    const handleDeleteBlock = (blockId) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.filter(b => b.id !== blockId)
        }));
    };

    const toggleBlockVisibility = (blockId) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b =>
                b.id === blockId ? { ...b, is_visible: !b.is_visible } : b
            )
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(content.blocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order field
        const reorderedBlocks = items.map((block, index) => ({
            ...block,
            order: index
        }));

        setContent(prev => ({
            ...prev,
            blocks: reorderedBlocks
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !content.tags.includes(tagInput.trim())) {
            setContent(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setContent(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !content.seo_keywords.includes(keywordInput.trim())) {
            setContent(prev => ({
                ...prev,
                seo_keywords: [...prev.seo_keywords, keywordInput.trim()]
            }));
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setContent(prev => ({
            ...prev,
            seo_keywords: prev.seo_keywords.filter(k => k !== keyword)
        }));
    };

    const handleSave = (status = 'DRAFT') => {
        onSave({ ...content, status });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#2C2419]">
                    {initialContent?.id ? 'Edit Content' : 'Create Content'}
                </h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => handleSave('DRAFT')}>
                        Save Draft
                    </Button>
                    <Button onClick={() => handleSave('PUBLISHED')} className="bg-[#8B7355] hover:bg-[#7A6548]">
                        Publish
                    </Button>
                </div>
            </div>

            {/* Template Selector */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <Label className="mb-2 block">Start with Template</Label>
                <Select onValueChange={(key) => {
                    const template = getTemplate(key);
                    if (confirm('This will replace your current blocks. Continue?')) {
                        setContent(prev => ({ ...prev, blocks: template.blocks }));
                    }
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(contentTemplates).map(([key, template]) => (
                            <SelectItem key={key} value={key}>
                                {template.name} - {template.description}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#2C2419]">Basic Information</h2>

                <div>
                    <Label>Title *</Label>
                    <Input
                        value={content.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Content title"
                        className="text-lg"
                    />
                </div>

                <div>
                    <Label>Excerpt</Label>
                    <textarea
                        value={content.excerpt || ''}
                        onChange={(e) => updateField('excerpt', e.target.value)}
                        placeholder="Short description..."
                        className="w-full p-3 border rounded-lg min-h-[80px]"
                    />
                </div>

                <div>
                    <Label>Cover Image URL</Label>
                    <Input
                        value={content.cover_image || ''}
                        onChange={(e) => updateField('cover_image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Content Type</Label>
                        <Select value={content.type} onValueChange={(v) => updateField('type', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTENT_TYPES.map(t => (
                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={content.category || ''} onValueChange={(v) => updateField('category', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Add tag..."
                        />
                        <Button type="button" onClick={handleAddTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {content.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#2C2419]">SEO</h2>

                <div>
                    <Label>SEO Title</Label>
                    <Input
                        value={content.seo_title || ''}
                        onChange={(e) => updateField('seo_title', e.target.value)}
                        placeholder="SEO optimized title"
                    />
                </div>

                <div>
                    <Label>SEO Description</Label>
                    <textarea
                        value={content.seo_description || ''}
                        onChange={(e) => updateField('seo_description', e.target.value)}
                        placeholder="Meta description..."
                        className="w-full p-3 border rounded-lg min-h-[60px]"
                    />
                </div>

                <div>
                    <Label>SEO Keywords</Label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                            placeholder="Add keyword..."
                        />
                        <Button type="button" onClick={handleAddKeyword}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {content.seo_keywords.map(keyword => (
                            <span key={keyword} className="px-3 py-1 bg-blue-50 rounded-full text-sm flex items-center gap-2">
                                {keyword}
                                <button onClick={() => handleRemoveKeyword(keyword)} className="text-blue-500 hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Blocks */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                <h2 className="text-xl font-semibold text-[#2C2419]">Content Blocks</h2>

                <BlockToolbar onAddBlock={handleAddBlock} />

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="blocks">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4 mt-6"
                            >
                                {content.blocks.length === 0 ? (
                                    <p className="text-center text-gray-500 py-12">
                                        No blocks yet. Click a button above to add your first block.
                                    </p>
                                ) : (
                                    content.blocks.map((block, index) => (
                                        <Draggable key={block.id} draggableId={block.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${snapshot.isDragging ? 'shadow-2xl' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div {...provided.dragHandleProps} className="flex flex-col items-center pt-4">
                                                            <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                                            <button
                                                                onClick={() => toggleBlockVisibility(block.id)}
                                                                className="mt-2 p-1 hover:bg-gray-100 rounded"
                                                            >
                                                                {block.is_visible ? (
                                                                    <Eye className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className="flex-1">
                                                            <BlockEditor
                                                                block={block}
                                                                onChange={(updated) => handleUpdateBlock(block.id, updated)}
                                                                onDelete={() => handleDeleteBlock(block.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
