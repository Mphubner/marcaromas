import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";

// --- CAMINHOS CORRIGIDOS (Relativos) ---
import { API_URL } from "../utils/api.js";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";

// Icons
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { motion } from "framer-motion";

// Hook para buscar um post
const useBlogPost = (slug) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      // No backend, vamos buscar pelo slug
      const res = await fetch(`${API_URL}/api/blog-posts/${slug}`);
      if (!res.ok) throw new Error("Post não encontrado");
      return res.json();
    },
    enabled: !!slug,
  });
};

export default function BlogPostPage() {
  const { slug } = useParams(); // Pega o ':slug' da URL
  const { data: post, isLoading, isError } = useBlogPost(slug);

  // Define o título da aba do navegador
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Marc Aromas`;
    }
  }, [post]);

  const categoryColors = {
    aromatherapy: "bg-purple-100 text-purple-800",
    self_care: "bg-pink-100 text-pink-800",
    wellness: "bg-green-100 text-green-800",
  };
  
  const categories = {
    aromatherapy: "Aromaterapia",
    self_care: "Autocuidado",
    wellness: "Bem-estar",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (isError || !post) {
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
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-br from-brand-primary to-brand-accent">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-brand-primary pl-6 italic">
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
            <div className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-a:text-brand-primary prose-strong:text-brand-dark">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

          </motion.div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gostou do conteúdo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Faça parte do Clube Marc Aromas e receba velas exclusivas todo mês
          </p>
          <Link to="/clube">
            <Button size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-gray-100">
              Conhecer o Clube
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}