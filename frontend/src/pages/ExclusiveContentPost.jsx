import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Block Renderer
import BlockRenderer from "@/components/content/blocks/BlockRenderer";

// Content Service
import contentService from "../services/contentService";

// Auth Context
import { useAuth } from "../context/AuthContext";

// SEO
import SEOHead from "@/components/shared/SEOHead";

export default function ExclusiveContentPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: post, isLoading } = useQuery({
        queryKey: ["exclusive-content", slug],
        queryFn: () => contentService.getBySlug(slug),
        enabled: !!slug,
    });

    // useEffect for title removed in favor of SEOHead

    // Check if user can access this content
    const canAccess = () => {
        if (!post) return false;

        // If no plans required, it's public
        if (!post.required_plan_ids || post.required_plan_ids.length === 0) {
            return true;
        }

        // User must be logged in
        if (!user) return false;

        // Get user's active plan IDs
        const userPlanIds = user.active_plan_ids || [];

        // Check if user has any required plan
        return post.required_plan_ids.some(planId => userPlanIds.includes(planId));
    };

    const hasAccess = canAccess();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] px-4">
                <h1 className="text-4xl font-bold text-[#2C2419] mb-4">Conteúdo não encontrado</h1>
                <p className="text-gray-600 mb-8">Este conteúdo não existe ou foi removido.</p>
                <Link to="/conteudo-exclusivo">
                    <Button className="bg-[#8B7355] hover:bg-[#7A6548]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Conteúdo Exclusivo
                    </Button>
                </Link>
            </div>
        );
    }

    // Locked content screen
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        {/* Cover Image with Lock Overlay */}
                        {post.cover_image && (
                            <div className="relative h-96 bg-gray-100">
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                    <Lock className="w-24 h-24 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="p-8 md:p-12 text-center">
                            <Badge className="mb-4 bg-amber-100 text-amber-800">
                                <Lock className="w-3 h-3 mr-1" />
                                Conteúdo Exclusivo
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']">
                                {post.title}
                            </h1>

                            {post.excerpt && (
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                    {post.excerpt}
                                </p>
                            )}

                            <div className="bg-gradient-to-r from-[#8B7355]/10 to-[#6B5845]/10 rounded-2xl p-8 mb-8">
                                <Lock className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
                                <h2 className="text-2xl font-bold text-[#2C2419] mb-3">
                                    Este conteúdo é exclusivo para membros
                                </h2>
                                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                    Faça parte do Clube Marc Aromas e tenha acesso ilimitado a artigos,
                                    vídeos, rituais e conteúdos especiais criados para você.
                                </p>

                                {!user ? (
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link to="/login">
                                            <Button variant="outline" size="lg">
                                                Fazer Login
                                            </Button>
                                        </Link>
                                        <Link to="/clube">
                                            <Button size="lg" className="bg-gradient-to-r from-[#8B7355] to-[#6B5845] hover:shadow-lg">
                                                Conhecer o Clube
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to="/clube">
                                        <Button size="lg" className="bg-gradient-to-r from-[#8B7355] to-[#6B5845] hover:shadow-lg">
                                            <Star className="w-5 h-5 mr-2" />
                                            Fazer Upgrade
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <Link to="/conteudo-exclusivo">
                                <Button variant="ghost">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar para Conteúdo Exclusivo
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Unlocked content
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <article className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SEOHead
                        title={post.seo_title || post.title}
                        description={post.seo_description || post.excerpt}
                        image={post.cover_image}
                        type="article"
                        publishedTime={post.publish_date}
                        modifiedTime={post.updated_at}
                        author={post.author?.name}
                        section={post.category}
                        tags={post.seo_keywords?.length > 0 ? post.seo_keywords : post.tags}
                    />

                    {/* Back Button */}
                    <Link to="/conteudo-exclusivo">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para Conteúdo Exclusivo
                        </Button>
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        {post.category && (
                            <Badge className="mb-4 bg-[#8B7355]/10 text-[#8B7355]">
                                <Star className="w-3 h-3 mr-1" />
                                Exclusivo
                            </Badge>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl text-gray-600 mb-6">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {post.publish_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {format(new Date(post.publish_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                    </span>
                                </div>
                            )}

                            {post.read_time_minutes && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.read_time_minutes} min de leitura</span>
                                </div>
                            )}

                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <span>Por {post.author.name}</span>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <BlockRenderer blocks={post.blocks} />
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to List */}
                    <div className="mt-12 text-center">
                        <Link to="/conteudo-exclusivo">
                            <Button className="bg-[#8B7355] hover:bg-[#7A6548]">
                                Ver Mais Conteúdo Exclusivo
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </article>
        </div>
    );
}
