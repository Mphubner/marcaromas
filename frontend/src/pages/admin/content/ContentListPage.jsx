import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import contentService from '../../../services/contentService';
import { format } from 'date-fns';

export default function ContentListPage() {
    const [filters, setFilters] = useState({ status: '', type: '' });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-content', filters],
        queryFn: () => contentService.admin.getAll(filters)
    });

    const statusColors = {
        DRAFT: 'bg-gray-100 text-gray-800',
        PUBLISHED: 'bg-green-100 text-green-800',
        ARCHIVED: 'bg-red-100 text-red-800'
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-[#2C2419]">Content Management</h1>
                <Link to="/admin/content/new">
                    <Button className="bg-[#8B7355] hover:bg-[#7A6548]">
                        <Plus className="w-4 h-4 mr-2" />
                        New Content
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6 flex gap-4">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                </select>

                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="">All Types</option>
                    <option value="BLOG_POST">Blog Post</option>
                    <option value="EXCLUSIVE_CONTENT">Exclusive Content</option>
                </select>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Title</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Blocks</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Views</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">Updated</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        {item.excerpt && (
                                            <p className="text-sm text-gray-500 truncate max-w-md">{item.excerpt}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge variant="outline">
                                        {item.type === 'BLOG_POST' ? 'Blog' : 'Exclusive'}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge className={statusColors[item.status]}>
                                        {item.status}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {item._count?.blocks || 0}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    <Eye className="w-4 h-4 inline mr-1" />
                                    {item.views}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {format(new Date(item.updated_at), 'dd/MM/yyyy')}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/admin/content/${item.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" className="text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
