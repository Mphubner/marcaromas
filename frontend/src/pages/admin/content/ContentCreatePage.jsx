import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import ContentEditor from '../../../components/admin/content/ContentEditor';
import contentService from '../../../services/contentService';

export default function ContentCreatePage() {
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: contentService.admin.create,
        onSuccess: () => {
            toast.success('Content created successfully!');
            navigate('/admin/content');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create content');
        }
    });

    const handleSave = (contentData) => {
        createMutation.mutate(contentData);
    };

    const handleCancel = () => {
        navigate('/admin/content');
    };

    return (
        <ContentEditor
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}
