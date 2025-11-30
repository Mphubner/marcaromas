import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Block Renderer
import BlockRenderer from "@/components/content/blocks/BlockRenderer";

// Content Service
import contentService from "../services/contentService";

// SEO
import SEOHead from "@/components/shared/SEOHead";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["content", slug],
    queryFn: () => contentService.getBySlug(slug),
    enabled: !!slug,
  });

  // useEffect for title removed in favor of SEOHead

  const categoryColors = {
    aromatherapy: "bg-purple-100 text-purple-800",
    self_care: "bg-pink-100 text-pink-800",
    wellness: "bg-green-100 text-green-800",
    behind_scenes: "bg-blue-100 text-blue-800"
  };

  const categories = {
    aromatherapy: "Aromaterapia",
    self_care: "Autocuidado",
    wellness: "Bem-estar",
    behind_scenes: "Bastidores"
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h2>
          <Link to="/blog">
            <Button>Voltar ao Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_image && (
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-br from-[#8B7355] to-[#D4A574]">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
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

            {/* Category and Date */}
            <div className="flex items-center gap-4 mb-6">
              {post.category && (
                <Badge className={categoryColors[post.category] || "bg-gray-100 text-gray-800"}>
                  {categories[post.category] || post.category}
                </Badge>
              )}
              {post.publish_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.publish_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-[#8B7355] pl-6 italic">
                {post.excerpt}
              </p>
            )}

            {/* Share Button */}
            <div className="flex gap-4 mb-12 pb-8 border-b">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <BlockRenderer blocks={post.blocks} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#8B7355] to-[#6B5845] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gostou do conteúdo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Faça parte do Clube Marc Aromas e receba velas exclusivas todo mês
          </p>
          <Link to="/clube">
            <Button size="lg" variant="secondary" className="bg-white text-[#8B7355] hover:bg-gray-100">
              Conhecer o Clube
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
