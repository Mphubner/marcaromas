import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users, Search, Filter, UserPlus, Mail, Phone,
  Calendar, DollarSign, ShoppingBag, Crown, Ban, Check, X
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers', { search, status: statusFilter, isAdmin: typeFilter }],
    queryFn: () => adminService.getAllUsers({ search, status: statusFilter || undefined, isAdmin: typeFilter || undefined }),
  });

  // Stats
  const stats = useMemo(() => {
    const active = customers.filter(c => c.status === 'active').length;
    const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgLifetimeValue = customers.length > 0 ? totalSpent / customers.length : 0;
    const newCustomers = customers.filter(c => {
      const createdDate = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;

    return {
      total: customers.length,
      active,
      newCustomers,
      avgLifetimeValue,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers;
  }, [customers]);

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: 'default', icon: Check, label: 'Ativo', color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary', icon: X, label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
      blocked: { variant: 'destructive', icon: Ban, label: 'Bloqueado', color: 'bg-red-100 text-red-800' },
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} rounded-lg`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 mt-1">Gerencie sua base de clientes</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Clientes</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Clientes Ativos</div>
                <div className="text-2xl font-bold">{stats.active}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Novos (30 dias)</div>
                <div className="text-2xl font-bold">{stats.newCustomers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">LTV Médio</div>
                <div className="text-2xl font-bold">R$ {stats.avgLifetimeValue.toFixed(2)}</div>
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
                placeholder="Buscar clientes..."
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
                  <option value="">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="blocked">Bloqueado</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                >
                  <option value="">Todos</option>
                  <option value="true">Admin</option>
                  <option value="false">Cliente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Customers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <Card
                key={customer.id}
                className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-lg font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-xs text-gray-500">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Type */}
                  <div className="flex gap-2">
                    {getStatusBadge(customer.status)}
                    {customer.isAdmin && (
                      <Badge className="bg-purple-100 text-purple-800 rounded-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Pedidos</div>
                      <div className="text-lg font-bold text-gray-900">{customer.totalOrders || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Gasto Total</div>
                      <div className="text-lg font-bold text-[#8B7355]">
                        R$ {(customer.totalSpent || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    <Link to={`/admin/customers/${customer.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg text-xs"
                      >
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <Card className="p-12 rounded-xl">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                <p className="text-sm mt-1">Ajuste os filtros ou aguarde novos cadastros</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
