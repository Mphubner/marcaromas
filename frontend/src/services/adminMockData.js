export const mockKPIs = [
  { id: 'rev', label: 'Receita (30d)', value: 'R$ 45.320', delta: '+12%' },
  { id: 'subs', label: 'Assinaturas Ativas', value: '1.240', delta: '+3%' },
  { id: 'orders', label: 'Pedidos (30d)', value: '860', delta: '+5%' },
  { id: 'mrr', label: 'MRR', value: 'R$ 12.400', delta: '+8%' },
];

export const mockSalesData = Array.from({ length: 14 }).map((_, i) => ({ date: `D-${13 - i}`, revenue: Math.floor(500 + Math.random() * 2000) }));

export const mockTickets = [
  { id: 'TCK-001', user_id: 'u123', subject: 'Pedido não chegou', priority: 'high', status: 'open' },
  { id: 'TCK-002', user_id: 'u456', subject: 'Produto com defeito', priority: 'medium', status: 'pending' },
  { id: 'TCK-003', user_id: 'u789', subject: 'Dúvida sobre assinatura', priority: 'low', status: 'closed' },
];
