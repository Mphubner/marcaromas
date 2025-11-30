import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para popular campos faltantes nos pedidos existentes
 * DEVE SER EXECUTADO ANTES da migration enhance_orders_management
 */

async function main() {
  console.log('🔧 Populando campos faltantes nos pedidos existentes...\n');

  // Buscar todos os pedidos existentes
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  });

  console.log(`📦 Encontrados ${orders.length} pedidos para atualizar\n`);

  for (const order of orders) {
    // Gerar orderNumber único
    const orderNumber = `ORD-2025-${String(order.id).padStart(6, '0')}`;

    // Calcular subtotal dos items
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Se o total existente for diferente do subtotal, assumir que a diferença é frete
    const shippingCost = order.total > subtotal ? order.total - subtotal : 0;

    // Definir valores padrão
    const updateData = {
      orderNumber,
      subtotal,
      shippingCost,
      discount: 0,
      tax: 0,
      channel: 'website', // padrão
      paymentMethod: ['credit_card', 'pix', 'debit_card', 'boleto'][Math.floor(Math.random() * 4)],
      paymentStatus: order.status === 'pending' ? 'pending' : 'approved',
    };

    // Se o pedido tem tracking_code, adicionar dados de envio
    if (order.tracking_code) {
      const carriers = ['Correios', 'Jadlog', 'Loggi'];
      const methods = ['PAC', 'SEDEX', 'Expresso'];
      
      updateData.carrier = carriers[Math.floor(Math.random() * carriers.length)];
      updateData.shippingMethod = methods[Math.floor(Math.random() * methods.length)];
      
      // Se tem tracking, provavelmente foi enviado
      if (order.status !== 'canceled') {
        updateData.shippedAt = new Date(order.createdAt.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 dias após criação
        updateData.estimatedDeliveryDate = new Date(order.createdAt.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 dias
        
        // Se o status é delivered, adicionar data de entrega
        if (order.status === 'delivered') {
          updateData.deliveredAt = new Date(order.createdAt.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 dias
        }
      }
    }

    // Se o pedido foi pago, adicionar data de pagamento
    if (order.status !== 'pending' && order.status !== 'canceled') {
      updateData.paidAt = new Date(order.createdAt.getTime() + (1 * 60 * 60 * 1000)); // 1 hora após criação
      updateData.confirmedAt = updateData.paidAt;
    }

    // Gerar endereço estruturado se shippingAddress existe
    if (order.shippingAddress && typeof order.shippingAddress === 'object') {
      const addr = order.shippingAddress;
      updateData.deliveryAddress = {
        name: order.user?.name || 'Cliente',
        cpf: '000.000.000-00',
        street: addr.street || addr.endereco || 'Rua Exemplo',
        number: addr.number || addr.numero || '100',
        complement: addr.complement || addr.complemento || null,
        neighborhood: addr.neighborhood || addr.bairro || 'Centro',
        city: addr.city || addr.cidade || 'São Paulo',
        state: addr.state || addr.estado || 'SP',
        zipCode: addr.zipCode || addr.cep || '00000-000',
        phone: addr.phone || addr.telefone || '(11) 00000-0000'
      };
      updateData.billingAddress = updateData.deliveryAddress; // Mesmo endereço por padrão
    }

    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "Order"
        SET 
          "orderNumber" = '${orderNumber}',
          "subtotal" = ${subtotal},
          "shippingCost" = ${shippingCost},
          "discount" = 0,
          "tax" = 0,
          "channel" = '${updateData.channel}',
          "paymentMethod" = ${updateData.paymentMethod ? `'${updateData.paymentMethod}'` : 'NULL'},
          "paymentStatus" = ${updateData.paymentStatus ? `'${updateData.paymentStatus}'` : 'NULL'}
          ${updateData.carrier ? `, "carrier" = '${updateData.carrier}'` : ''}
          ${updateData.shippingMethod ? `, "shippingMethod" = '${updateData.shippingMethod}'` : ''}
          ${updateData.paidAt ? `, "paidAt" = '${updateData.paidAt.toISOString()}'` : ''}
          ${updateData.confirmedAt ? `, "confirmedAt" = '${updateData.confirmedAt.toISOString()}'` : ''}
          ${updateData.shippedAt ? `, "shippedAt" = '${updateData.shippedAt.toISOString()}'` : ''}
          ${updateData.deliveredAt ? `, "deliveredAt" = '${updateData.deliveredAt.toISOString()}'` : ''}
          ${updateData.estimatedDeliveryDate ? `, "estimatedDeliveryDate" = '${updateData.estimatedDeliveryDate.toISOString()}'` : ''}
          ${updateData.deliveryAddress ? `, "deliveryAddress" = '${JSON.stringify(updateData.deliveryAddress)}'::jsonb` : ''}
          ${updateData.billingAddress ? `, "billingAddress" = '${JSON.stringify(updateData.billingAddress)}'::jsonb` : ''}
        WHERE id = ${order.id}
      `);

      console.log(`  ✅ Pedido #${order.id} (${orderNumber}) atualizado`);
    } catch (error) {
      console.error(`  ❌ Erro ao atualizar pedido #${order.id}:`, error.message);
    }
  }

  console.log(`\n✅ ${orders.length} pedidos atualizados com sucesso!\n`);
  console.log('Agora você pode executar: npx prisma migrate dev\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
