import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, Search, Tag, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Content Service
import contentService from "../services/contentService";

// SEO
import SEOHead from "@/components/shared/SEOHead";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["blog-content"],
    queryFn: () => contentService.getAll({ type: 'BLOG_POST' }),
  });

  const posts = data?.content || [];

  const categories = [
    { value: "all", label: "Todas", icon: "📚" },
    { value: "aromatherapy", label: "Aromaterapia", icon: "🌿" },
    { value: "self_care", label: "Autocuidado", icon: "💆" },
    { value: "wellness", label: "Bem-estar", icon: "✨" },
    { value: "behind_scenes", label: "Bastidores", icon: "🎬" }
  ];

  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  const calculateReadingTime = (blocks) => {
    if (!blocks || blocks.length === 0) return 5;
    const wordsPerMinute = 200;
    // Estimate word count from blocks
    const estimatedWords = blocks.length * 150; // ~150 words per block average
    const minutes = Math.ceil(estimatedWords / wordsPerMinute);
    return minutes || 5;
  };

  let filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    const matchesSearch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
      <SEOHead
        title="Essenza Blog - Dicas e Conhecimento"
        description="Explore o universo da aromaterapia, autocuidado e bem-estar com artigos exclusivos da Marc Aromas."
        keywords={["aromaterapia", "autocuidado", "bem-estar", "óleos essenciais", "blog"]}
        url="https://marcaromas.com.br/aromaterapia"
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#8B7355] to-[#6B5845] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Essenza Blog
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Dicas, momentos e conhecimento sobre aromaterapia, autocuidado e vida consciente
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-lg">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar artigos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-[#8B7355]" />
                    <h3 className="font-bold text-[#2C2419]">Categorias</h3>
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.value
                          ? "bg-[#8B7355] text-white"
                          : "hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {allTags.length > 0 && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-[#8B7355]" />
                      <h3 className="font-bold text-[#2C2419]">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${selectedTag === tag
                            ? "bg-[#8B7355] hover:bg-[#6B5845]"
                            : "hover:bg-[#8B7355]/10"
                            }`}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {selectedTag && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTag(null)}
                        className="w-full mt-3 text-xs"
                      >
                        Limpar filtro
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou busca
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo' : 'artigos'}
                    {selectedCategory !== "all" && ` em ${categories.find(c => c.value === selectedCategory)?.label}`}
                    {selectedTag && ` com tag "${selectedTag}"`}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, index) => {
                    const category = categories.find(c => c.value === post.category);
                    const readingTime = post.read_time_minutes || calculateReadingTime(post.blocks);
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={`/blog/${post.slug}`}>
                          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full overflow-hidden group">
                            {post.cover_image && (
                              <div className="aspect-video overflow-hidden">
                                <img
                                  src={post.cover_image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex items-center gap-2 mb-3">
                                {category && (
                                  <Badge className="bg-[#8B7355]/10 text-[#8B7355]">
                                    {category.icon} {category.label}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{readingTime} min de leitura</span>
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-[#2C2419] mb-3 group-hover:text-[#8B7355] transition-colors">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                  {post.excerpt}
                                </p>
                              )}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {post.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {post.publish_date
                                    ? format(new Date(post.publish_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
                                    : format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })
                                  }
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

