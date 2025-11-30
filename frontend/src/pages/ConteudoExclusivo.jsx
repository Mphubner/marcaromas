import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import contentService from '../services/contentService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ConteudoExclusivo() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['exclusive-content'],
    queryFn: () => contentService.getAll({ type: 'EXCLUSIVE_CONTENT' })
  });

  const content = data?.content || [];

  // Get user's active plan IDs (mock - should come from user context/API)
  const userPlanIds = user?.active_plan_ids || [];

  const canAccess = (item) => {
    // If no plans required, it's public
    if (!item.required_plan_ids || item.required_plan_ids.length === 0) {
      return true;
    }
    // Check if user has any of the required plans
    return item.required_plan_ids.some(planId => userPlanIds.includes(planId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C2419] mb-4 font-['Playfair_Display']">
              Conteúdo Exclusivo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Artigos, vídeos e rituais pensados especialmente para membros do Clube Marc Aromas
            </p>
          </motion.div>
        </header>

        {content.length === 0 ? (
          <div className="text-center py-20">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum conteúdo disponível ainda
            </h3>
            <p className="text-gray-600">
              Novos conteúdos exclusivos em breve!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {content.map((item, index) => {
              const hasAccess = canAccess(item);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full overflow-hidden hover:shadow-lg transition-all ${!hasAccess && 'opacity-75'}`}>
                    {/* Cover Image */}
                    {item.cover_image && (
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/placeholder-article.jpg'; }}
                        />
                        {!hasAccess && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Category Badge */}
                      {item.category && (
                        <Badge className="mb-3 bg-[#8B7355]/10 text-[#8B7355]">
                          {item.category === 'aromatherapy' && 'Aromaterapia'}
                          {item.category === 'self_care' && 'Autocuidado'}
                          {item.category === 'wellness' && 'Bem-estar'}
                          {item.category === 'behind_scenes' && 'Bastidores'}
                        </Badge>
                      )}

                      {/* Title */}
                      <h3 className="font-semibold text-lg text-[#2C2419] mb-2">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      {item.excerpt && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        {item.publish_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(item.publish_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        )}
                        {item.views > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views} views
                          </div>
                        )}
                      </div>

                      {/* Access/Lock Status */}
                      <div className="mt-4">
                        {hasAccess ? (
                          <Link to={`/conteudo-exclusivo/${item.slug}`}>
                            <button className="w-full text-sm bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#6B5845] transform hover:-translate-y-0.5 transition-all">
                              Ler Artigo
                            </button>
                          </Link>
                        ) : (
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                              <Lock className="w-4 h-4" />
                              <span className="font-medium">Conteúdo Exclusivo</span>
                            </div>
                            <Link to="/clube">
                              <button className="w-full text-sm bg-gradient-to-r from-[#8B7355] to-[#6B5845] text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                Fazer Upgrade
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA for non-members */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-gradient-to-r from-[#8B7355] to-[#6B5845] text-white rounded-2xl p-12"
          >
            <Lock className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4 font-['Playfair_Display']">
              Desbloqueie Todo o Conteúdo
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Faça parte do Clube Marc Aromas e tenha acesso ilimitado a artigos exclusivos,
              vídeos, rituais e muito mais
            </p>
            <Link to="/clube">
              <button className="bg-white text-[#8B7355] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transform hover:-translate-y-1 transition-all shadow-lg">
                Conhecer o Clube
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
