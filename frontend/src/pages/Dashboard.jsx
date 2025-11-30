import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  ShoppingCart,
  CreditCard,
  Trophy,
  Gift,
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  User,
  Settings,
  LogOut,
  Eye,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Swiper for carousel
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Premium Client Components
import {
  ClientCard,
  ClientButton,
  ClientStats,
  ClientBadge,
  getStatusBadge
} from '@/components/client';

// Services
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    enabled: !!user
  });

  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: dashboardService.getRecentOrders,
    enabled: !!user
  });

  const { data: subscription } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: dashboardService.getMySubscription,
    enabled: !!user
  });

  const isLoading = statsLoading || ordersLoading;

  // Quick Actions Grid
  const quickActions = [
    {
      icon: ShoppingCart,
      label: 'Fazer Pedido',
      description: 'Explore nossa loja',
      link: '/loja',
      color: 'from-[#8B7355] to-[#7A6548]'
    },
    {
      icon: Package,
      label: 'Meus Pedidos',
      description: 'Ver histórico',
      link: '/minhas-compras',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      label: 'Minha Assinatura',
      description: 'Gerenciar plano',
      link: '/minha-assinatura',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: User,
      label: 'Meu Perfil',
      description: 'Editar dados',
      link: '/perfil',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Trophy,
      label: 'Conquistas',
      description: 'Ver badges',
      link: '/minhas-conquistas',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Gift,
      label: 'Indicar Amigos',
      description: 'Ganhar recompensas',
      link: '/indicacoes',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B7355] mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2419] mb-2 font-['Playfair_Display']">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Cliente'}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Bem-vindo de volta ao seu painel pessoal
              </p>
            </div>

            {/* Avatar */}
            <div className="hidden md:block">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ClientStats
            icon={Package}
            label="Total de Pedidos"
            value={stats?.totalOrders || 0}
            trend="up"
            trendValue="+2 este mês"
            delay={0}
          />
          <ClientStats
            icon={CreditCard}
            label="Gasto Total"
            value={stats?.totalSpent || 0}
            format="currency"
            trend="up"
            trendValue="+12%"
            delay={0.1}
          />
          <ClientStats
            icon={Trophy}
            label="Pontos"
            value={stats?.points || 0}
            trend="up"
            trendValue="+50 pontos"
            delay={0.2}
          />
          <ClientStats
            icon={Heart}
            label="Status"
            value={subscription?.status === 'ACTIVE' ? 'Premium' : 'Padrão'}
            format="number"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#2C2419] font-['Playfair_Display']">
                  Pedidos Recentes
                </h2>
                <Link to="/minhas-compras">
                  <ClientButton variant="ghost" size="sm">
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </ClientButton>
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <ClientCard>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
                    <ClientButton onClick={() => navigate('/loja')}>
                      Explorar Loja
                    </ClientButton>
                  </div>
                </ClientCard>
              ) : (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  className="pb-12"
                >
                  {recentOrders.slice(0, 5).map((order) => {
                    const statusInfo = getStatusBadge(order.status);

                    return (
                      <SwiperSlide key={order.id}>
                        <ClientCard hoverable>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-[#2C2419]">
                                  Pedido #{order.orderNumber || order.id}
                                </h3>
                                <ClientBadge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </ClientBadge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-[#8B7355] font-['Playfair_Display'] mt-2 md:mt-0">
                              R$ {order.total.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {order.items?.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                  <img
                                    src={item.product?.images?.[0] || item.product?.image}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {order.items?.length > 3 && (
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-[#8B7355] flex items-center justify-center text-white text-sm font-bold">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>

                            <ClientButton
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/pedido/${order.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </ClientButton>
                          </div>
                        </ClientCard>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#2C2419] mb-4 font-['Playfair_Display']">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (index * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link to={action.link}>
                        <div className={`rounded-2xl bg-gradient-to-br ${action.color} p-6 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}>
                          <Icon className="w-8 h-8 mb-3" />
                          <h3 className="font-bold text-lg mb-1">{action.label}</h3>
                          <p className="text-sm text-white/80">{action.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">

            {/* Subscription Card */}
            {subscription && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <ClientCard gradient hoverable={false}>
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Sua Assinatura
                    </h3>
                    <div className="mb-4">
                      <ClientBadge variant={subscription.status === 'ACTIVE' ? 'active' : 'warning'}>
                        {subscription.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                      </ClientBadge>
                    </div>
                    <p className="text-lg font-semibold text-white/90 mb-1">
                      {subscription.plan?.name || 'Plano Básico'}
                    </p>
                    <p className="text-3xl font-bold text-white mb-6 font-['Playfair_Display']">
                      R$ {subscription.plan?.price?.toFixed(2) || '0.00'}/mês
                    </p>
                    <ClientButton
                      variant="secondary"
                      className="w-full"
                      onClick={() => navigate('/minha-assinatura')}
                    >
                      Gerenciar Assinatura
                    </ClientButton>
                  </div>
                </ClientCard>
              </motion.div>
            )}

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <ClientCard title="Minha Conta">
                <div className="space-y-3">
                  <Link to="/perfil">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <User className="w-5 h-5 text-[#8B7355]" />
                      <span className="font-medium">Editar Perfil</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </button>
                  </Link>

                  <Link to="/enderecos">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <MapPin className="w-5 h-5 text-[#8B7355]" />
                      <span className="font-medium">Endereços</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </button>
                  </Link>

                  <Link to="/perfil">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <Settings className="w-5 h-5 text-[#8B7355]" />
                      <span className="font-medium">Configurações</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                    </button>
                  </Link>

                  <div className="pt-3 border-t">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              </ClientCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
