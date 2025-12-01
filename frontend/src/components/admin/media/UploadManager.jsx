import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
    Upload,
    Folder,
    Image as ImageIcon,
    Trash2,
    Copy,
    MoreVertical,
    ArrowLeft,
    Loader2,
    Search,
    Grid,
    List as ListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UploadManager({ onSelect, selectMode = false }) {
    const queryClient = useQueryClient();
    const [currentPath, setCurrentPath] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch files
    const { data, isLoading } = useQuery({
        queryKey: ['files', currentPath],
        queryFn: async () => {
            const response = await api.get('/uploads', {
                params: { path: currentPath }
            });
            return response.data.files;
        }
    });

    // Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', currentPath);

            await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['files', currentPath]);
            toast.success('Upload concluído');
        },
        onError: () => {
            toast.error('Erro no upload');
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (filename) => {
            await api.delete(`/uploads/${filename}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['files', currentPath]);
            toast.success('Arquivo excluído');
            setSelectedFile(null);
        }
    });

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        try {
            await Promise.all(acceptedFiles.map(file => uploadMutation.mutateAsync(file)));
        } finally {
            setUploading(false);
        }
    }, [uploadMutation]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        }
    });

    const handleNavigate = (folderName) => {
        setCurrentPath(prev => prev ? `${prev}/${folderName}` : folderName);
        setSelectedFile(null);
    };

    const handleNavigateUp = () => {
        setCurrentPath(prev => {
            const parts = prev.split('/');
            parts.pop();
            return parts.join('/');
        });
        setSelectedFile(null);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copiada!');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {currentPath && (
                            <Button variant="ghost" size="icon" onClick={handleNavigateUp}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Folder className="w-5 h-5 text-yellow-500" />
                            {currentPath || 'Raiz'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewMode === 'grid' ? 'white' : 'ghost'}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'white' : 'ghost'}
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setViewMode('list')}
                            >
                                <ListIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Upload className="w-4 h-4 mr-2" /> Upload
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload de Arquivos</DialogTitle>
                                </DialogHeader>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-sm text-gray-600">
                                        Arraste arquivos aqui ou clique para selecionar
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-auto p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : data?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Folder className="w-16 h-16 mb-4 opacity-20" />
                            <p>Pasta vazia</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                            {data?.map((file) => (
                                <div
                                    key={file.name}
                                    className={`
                    group relative border rounded-lg cursor-pointer transition-all hover:border-blue-500
                    ${selectedFile?.name === file.name ? 'ring-2 ring-blue-500 border-transparent' : ''}
                    ${viewMode === 'list' ? 'flex items-center gap-4 p-2' : 'p-2'}
                  `}
                                    onClick={() => file.isFolder ? handleNavigate(file.name) : setSelectedFile(file)}
                                >
                                    {/* Thumbnail */}
                                    <div className={`${viewMode === 'grid' ? 'aspect-square mb-2' : 'w-10 h-10'} bg-gray-100 rounded flex items-center justify-center overflow-hidden`}>
                                        {file.isFolder ? (
                                            <Folder className="w-8 h-8 text-yellow-500" />
                                        ) : (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        {viewMode === 'list' && (
                                            <p className="text-xs text-muted-foreground">
                                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : '-'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Details */}
            {selectedFile && !selectedFile.isFolder && (
                <div className="w-80 bg-white rounded-lg border shadow-sm p-4 flex flex-col">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                        <img
                            src={selectedFile.url}
                            alt={selectedFile.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-medium text-gray-500">Nome</label>
                            <p className="text-sm break-all">{selectedFile.name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Tamanho</label>
                                <p className="text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Tipo</label>
                                <p className="text-sm">{selectedFile.mimeType || 'Imagem'}</p>
                            </div>
                        </div>

                        {selectedFile.lastModified && (
                            <div>
                                <label className="text-xs font-medium text-gray-500">Modificado em</label>
                                <p className="text-sm">
                                    {format(new Date(selectedFile.lastModified), 'dd/MM/yyyy HH:mm')}
                                </p>
                            </div>
                        )}

                        <div className="pt-4 space-y-2">
                            {selectMode ? (
                                <Button className="w-full" onClick={() => onSelect(selectedFile.url)}>
                                    Selecionar Imagem
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full" onClick={() => copyToClipboard(selectedFile.url)}>
                                    <Copy className="w-4 h-4 mr-2" /> Copiar URL
                                </Button>
                            )}

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => deleteMutation.mutate(selectedFile.name)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
