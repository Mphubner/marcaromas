import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, Star, CheckCircle, XCircle, MessageSquare, Flag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewsListPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [respondModal, setRespondModal] = useState(null);
    const [adminResponse, setAdminResponse] = useState('');
    const queryClient = useQueryClient();

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['admin-reviews', { search, status: statusFilter, rating: ratingFilter }],
        queryFn: () => adminService.getAllReviews({ search, status: statusFilter, rating: ratingFilter }),
    });

    const { data: stats } = useQuery({
        queryKey: ['admin-review-stats'],
        queryFn: () => adminService.getReviewStats(),
    });

    const approveMutation = useMutation({
        mutationFn: (reviewId) => adminService.approveReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reviews']);
            toast.success('Review aprovada!');
        },
    });

    const respondMutation = useMutation({
        mutationFn: ({ reviewId, adminResponse }) =>
            adminService.respondToReview(reviewId, { adminResponse, respondedBy: 'admin' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reviews']);
            setRespondModal(null);
            setAdminResponse('');
            toast.success('Resposta enviada!');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (reviewId) => adminService.deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-reviews']);
            toast.success('Review deletada!');
        },
    });

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Avaliações</h2>
                <p className="text-gray-500 mt-1">Gerencie avaliações de clientes</p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Total Reviews</div>
                                <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Aguardando Aprovação</div>
                                <div className="text-2xl font-bold">{stats?.pendingReviews || 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Star className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Média de Avaliação</div>
                                <div className="text-2xl font-bold">{stats?.avgRating || 0}/5</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow rounded-xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Flag className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Reportadas</div>
                                <div className="text-2xl font-bold">{stats?.reportedReviews || 0}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="rounded-xl">
                <div className="p-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar reviews..."
                                className="pl-8 rounded-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`rounded-lg ${showFilters ? 'bg-[#8B7355] text-white' : ''}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                >
                                    <option value="">Todas</option>
                                    <option value="pending">Pendente</option>
                                    <option value="approved">Aprovadas</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Avaliação</label>
                                <select
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                >
                                    <option value="">Todas</option>
                                    <option value="5">5 Estrelas</option>
                                    <option value="4">4 Estrelas</option>
                                    <option value="3">3 Estrelas</option>
                                    <option value="2">2 Estrelas</option>
                                    <option value="1">1 Estrela</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Reviews Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reviews.map(review => (
                        <Card key={review.id} className="group hover:shadow-lg transition-all rounded-xl">
                            <CardHeader className="bg-gray-50 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {renderStars(review.rating)}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {review.userName || review.userEmail}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {review.is_approved ? (
                                            <Badge className="bg-green-100 text-green-800 rounded-lg">Aprovada</Badge>
                                        ) : (
                                            <Badge className="bg-yellow-100 text-yellow-800 rounded-lg">Pendente</Badge>
                                        )}
                                        {review.reported && (
                                            <Badge className="bg-red-100 text-red-800 rounded-lg">
                                                <Flag className="w-3 h-3 mr-1" />
                                                Reportada
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-4">
                                {review.title && <div className="font-semibold">{review.title}</div>}
                                <p className="text-sm text-gray-600">{review.comment}</p>

                                {review.adminResponse && (
                                    <div className="border-l-4 border-[#8B7355] pl-4 bg-gray-50 p-3 rounded-lg">
                                        <div className="text-xs font-medium text-gray-500 mb-1">Resposta da Loja:</div>
                                        <div className="text-sm">{review.adminResponse}</div>
                                    </div>
                                )}

                                <div className="pt-3 border-t flex gap-2">
                                    {!review.is_approved && (
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                            onClick={() => approveMutation.mutate(review.id)}
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Aprovar
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-lg"
                                        onClick={() => setRespondModal(review)}
                                    >
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        Responder
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="rounded-lg"
                                        onClick={() => {
                                            if (confirm('Deletar esta review?')) {
                                                deleteMutation.mutate(review.id);
                                            }
                                        }}
                                    >
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Deletar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Respond Modal */}
            {respondModal && (
                <Dialog open={!!respondModal} onOpenChange={() => setRespondModal(null)}>
                    <DialogContent className="rounded-xl bg-white">
                        <DialogHeader>
                            <DialogTitle>Responder Review</DialogTitle>
                            <DialogDescription>Envie uma resposta para o cliente</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <div className="flex gap-1 mb-2">{renderStars(respondModal.rating)}</div>
                                <p className="text-sm text-gray-600 italic">"{respondModal.comment}"</p>
                            </div>
                            <Textarea
                                placeholder="Digite sua resposta..."
                                rows={4}
                                className="rounded-lg"
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                            />
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" className="rounded-lg" onClick={() => setRespondModal(null)}>
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-[#8B7355] hover:bg-[#6d5940] text-white rounded-lg"
                                    onClick={() => respondMutation.mutate({ reviewId: respondModal.id, adminResponse })}
                                    disabled={!adminResponse.trim()}
                                >
                                    Enviar Resposta
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
