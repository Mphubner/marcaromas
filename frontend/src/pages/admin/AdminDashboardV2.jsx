import React from 'react';
import AdminKPIGrid from '../../components/admin/dashboard/AdminKPIGrid';
import AdminRevenueChart from '../../components/admin/dashboard/AdminRevenueChart';
import { mockKPIs, mockSalesData, mockTickets } from '../../services/adminMockData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Download, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const AdminDashboardV2 = () => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'closed': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'closed': return <CheckCircle className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2C2419]">Visão Geral do Negócio</h2>
          <p className="text-gray-500">Acompanhe o desempenho em tempo real.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border shadow-sm">
          <div className="flex items-center px-3 py-2 text-sm text-gray-600 border-r border-gray-200">
            <Calendar className="w-4 h-4 mr-2 text-[#8B7355]" />
            <select className="bg-transparent border-none font-medium text-[#2C2419] outline-none ml-1 cursor-pointer">
              <option>Últimos 30 dias</option>
              <option>Este Mês</option>
            </select>
          </div>
          <Button variant="ghost" size="sm" className="text-[#8B7355] hover:bg-[#8B7355]/10">
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <AdminKPIGrid data={mockKPIs} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <AdminRevenueChart data={mockSalesData} />
        </div>
        <div className="lg:col-span-1 h-full">
          <Card className="h-full border-none shadow-sm bg-white flex flex-col">
            <CardHeader className="flex items-center justify-between"><CardTitle>Suporte Recente</CardTitle><Badge variant="outline">{mockTickets.filter(t => t.status === 'open').length} Abertos</Badge></CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {mockTickets.map(ticket => (
                  <div key={ticket.id} className="group p-3 rounded-lg border border-gray-100 hover:border-[#8B7355]/30 hover:bg-[#8B7355]/5 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`text-xs font-medium px-2 py-0.5 border ${getPriorityColor(ticket.priority)}`}>{ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}</Badge>
                      <span className="text-xs text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1"/> há 2h</span>
                    </div>
                    <h4 className="font-medium text-sm text-[#2C2419] mb-1">{ticket.subject}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{ticket.user_id.slice(0,2).toUpperCase()}</div><span>ID: {ticket.id}</span></div>
                      <div className={`flex items-center text-xs px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>{getStatusIcon(ticket.status)}<span className="capitalize">{ticket.status === 'open' ? 'Aberto' : 'Fechado'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-gray-100 mt-auto">
              <Button variant="outline" className="w-full text-sm border-dashed border-gray-300 text-gray-500 hover:text-[#8B7355] hover:border-[#8B7355]">Ver Todos os Tickets <ExternalLink className="w-3 h-3 ml-2" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardV2;
