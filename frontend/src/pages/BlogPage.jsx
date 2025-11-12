import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { API_URL } from '../utils/api';

const categories = [
  { id: 'all', name: 'Todas', icon: '📚' },
  { id: 'aromaterapia', name: 'Aromaterapia', icon: '🌿' },
  { id: 'autocuidado', name: 'Autocuidado', icon: '🧘‍♀️' },
  { id: 'bem-estar', name: 'Bem-estar', icon: '✨' },
  { id: 'bastidores', name: 'Bastidores', icon: '🎬' }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/blog-posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Aromaterapia & Bem-Estar
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Dicas, rituais e conhecimento sobre aromaterapia, autocuidado e vida consciente
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Categories */}
          <div className="mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          className={`${
                            post.category === 'aromaterapia'
                              ? 'bg-green-100 text-green-800'
                              : post.category === 'autocuidado'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readingTime} min de leitura
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {post.tags?.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
