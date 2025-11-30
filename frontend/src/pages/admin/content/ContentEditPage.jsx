import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import ContentEditor from '../../../components/admin/content/ContentEditor';
import contentService from '../../../services/contentService';

export default function ContentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: content, isLoading } = useQuery({
        queryKey: ['content', id],
        queryFn: () => contentService.admin.getById(id),
        enabled: !!id
    });

    const updateMutation = useMutation({
        mutationFn: (contentData) => contentService.admin.update(id, contentData),
        onSuccess: () => {
            toast.success('Content updated successfully!');
            navigate('/admin/content');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update content');
        }
    });

    const handleSave = (contentData) => {
        updateMutation.mutate(contentData);
    };

    const handleCancel = () => {
        navigate('/admin/content');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    return (
        <ContentEditor
            initialContent={content}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}
