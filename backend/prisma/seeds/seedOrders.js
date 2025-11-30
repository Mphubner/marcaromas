import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed de 100 pedidos completos com ciclo de vida variado
 * Inclui histórico de eventos para cada pedido
 */

// Arrays de dados realistas
const paymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
const carriers = ['Correios', 'Jadlog', 'Loggi'];
const shippingMethods = ['PAC', 'SEDEX', 'Expresso'];
const channels = ['website', 'whatsapp', 'instagram', 'marketplace'];
const statusOptions = ['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'];

// Dados de endereço
const brazilianStates = ['SP', 'RJ', 'MG', 'RS', 'BA', 'PR', 'SC', 'PE', 'CE', 'GO'];
const cities = {
    SP: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
    MG: ['Belo Horizonte', 'Uberlândia', 'Contagem'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Canoas'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
    PR: ['Curitiba', 'Londrina', 'Maringá'],
    SC: ['Florianópolis', 'Joinville', 'Blumenau'],
    PE: ['Recife', 'Olinda', 'Jaboatão'],
    CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
    GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis']
};

const streets = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Av. Brasil', 'Rua do Comércio', 'Av. Atlântica'];
const neighborhoods = ['Centro', 'Jardins', 'Vila Mariana', 'Copacabana', 'Savassi', 'Boa Viagem'];

// Helper para gerar endereço
function generateAddress(userName) {
    const state = brazilianStates[Math.floor(Math.random() * brazilianStates.length)];
    const city = cities[state][Math.floor(Math.random() * cities[state].length)];

    return {
        name: userName,
        cpf: `${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}.${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}.${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        street: streets[Math.floor(Math.random() * streets.length)],
        number: String(Math.floor(Math.random() * 2000) + 1),
        complement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 400) + 1}` : null,
        neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
        city,
        state,
        zipCode: `${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        phone: `(${Math.floor(Math.random() * 90) + 11}) ${Math.floor(Math.random() * 90000) + 90000}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    };
}

// Helper para gerar tracking code
function generateTrackingCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return `BR${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}BR`;
}

async function main() {
    console.log('🚀 Iniciando seed de pedidos...\n');

    // Buscar usuários, produtos e coletar counters
    const users = await prisma.user.findMany({ take: 20 });
    const products = await prisma.product.findMany({ take: 50 });

    if (users.length === 0) {
        console.error('❌ Nenhum usuário encontrado. Execute o seed de usuários primeiro.');
        return;
    }

    if (products.length === 0) {
        console.error('❌ Nenhum produto encontrado. Execute o seed de produtos primeiro.');
        return;
    }

    console.log(`📦 Encontrados ${users.length} usuários e ${products.length} produtos\n`);

    // Contador para orderNumber
    const existingOrders = await prisma.order.count();
    let orderCounter = existingOrders + 1;

    // Distribuição de status (total: 100 pedidos)
    const statusDistribution = {
        delivered: 35,
        shipped: 20,
        paid: 15,
        processing: 10,
        confirmed: 10,
        pending: 5,
        canceled: 3,
        refunded: 2
    };

    const ordersToCreate = [];

    for (const [status, count] of Object.entries(statusDistribution)) {
        for (let i = 0; i < count; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const numItems = Math.floor(Math.random() * 3) + 1; // 1 a 3 items
            const selectedProducts = [];

            for (let j = 0; j < numItems; j++) {
                selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
            }

            // Calcular valores
            const itemsData = selectedProducts.map(p => ({
                productId: p.id,
                quantity: Math.floor(Math.random() * 2) + 1,
                price: p.price
            }));

            const subtotal = itemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shippingCost = Math.floor(Math.random() * 30) + 10; // R$ 10-40
            const discount = Math.random() > 0.8 ? Math.floor(subtotal * 0.1) : 0; // 10% em 20% dos pedidos
            const total = subtotal + shippingCost - discount;

            // Data de criação (últimos 90 dias)
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));

            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const channel = channels[Math.floor(Math.random() * channels.length)];
            const address = generateAddress(user.name);

            // Preparar dados do pedido
            const orderData = {
                orderNumber: `ORD-2025-${String(orderCounter).padStart(6, '0')}`,
                userId: user.id,
                subtotal,
                discount,
                shippingCost,
                tax: 0,
                total,
                status,
                channel,
                paymentMethod,
                deliveryAddress: address,
                billingAddress: address,
                createdAt,
                updatedAt: createdAt,
                items: {
                    create: itemsData
                }
            };

            // Adicionar campos específicos por status
            if (status !== 'pending' && status !== 'canceled') {
                orderData.paymentStatus = 'approved';
                orderData.paidAt = new Date(createdAt.getTime() + (2 * 60 * 60 * 1000)); // 2h após criação
                orderData.confirmedAt = orderData.paidAt;
            } else if (status === 'pending') {
                orderData.paymentStatus = 'pending';
            }

            if (['shipped', 'delivered'].includes(status)) {
                orderData.carrier = carriers[Math.floor(Math.random() * carriers.length)];
                orderData.shippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)];
                orderData.tracking_code = generateTrackingCode();
                orderData.shippedAt = new Date(createdAt.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 dias
                orderData.estimatedDeliveryDate = new Date(createdAt.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 dias
                orderData.labelGeneratedAt = new Date(createdAt.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 dias
                orderData.labelUrl = `https://storage.example.com/labels/${orderData.orderNumber}.pdf`;
            }

            if (status === 'delivered') {
                orderData.deliveredAt = new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000));  // 7 dias
            }

            if (status === 'canceled') {
                orderData.canceledAt = new Date(createdAt.getTime() + (1 * 24 * 60 * 60 * 1000)); // 1 dia
                orderData.cancellationReason = ['Cliente solicitou cancelamento', 'Produto indisponível', 'Erro no endereço'][Math.floor(Math.random() * 3)];
                orderData.paymentStatus = 'refunded';
            }

            if (status === 'refunded') {
                orderData.refundedAt = new Date(createdAt.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 dias
                orderData.refundAmount = total;
                orderData.paymentStatus = 'refunded';
                orderData.notes = 'Reembolso processado conforme solicitação do cliente.';
            }

            // Adicionar observações aleatórias
            if (Math.random() > 0.7) {
                orderData.customerNotes = [
                    'Por favor, entregar após às 18h',
                    'Deixar com o porteiro se não houver ninguém',
                    'Casa amarela com portão branco',
                    'Tocar a campainha 2 vezes'
                ][Math.floor(Math.random() * 4)];
            }

            if (Math.random() > 0.8) {
                orderData.notes = [
                    'Cliente VIP - priorizar envio',
                    'Segundo pedido do cliente este mês',
                    'Cliente solicitou embalagem especial',
                    'Verificar estoque antes de confirmar'
                ][Math.floor(Math.random() * 4)];
            }

            if (Math.random() > 0.9) {
                orderData.couponCode = ['PRIMEIRACOMPRA', 'BLACKFRIDAY10', 'FRETEGRATIS', 'AMIGO15'][Math.floor(Math.random() * 4)];
            }

            ordersToCreate.push(orderData);
            orderCounter++;
        }
    }

    console.log(`📝 Criando ${ordersToCreate.length} pedidos...\n`);

    // Criar pedidos e histórico
    for (const orderData of ordersToCreate) {
        try {
            const order = await prisma.order.create({
                data: orderData,
                include: {
                    items: true
                }
            });

            // Criar histórico de eventos para cada pedido
            const historyEvents = [];

            // Evento: Criação do pedido
            historyEvents.push({
                orderId: order.id,
                eventType: 'status_change',
                eventStatus: 'success',
                description: `Pedido ${order.orderNumber} criado via ${order.channel}`,
                metadata: { channel: order.channel, items_count: order.items.length },
                createdBy: 'system',
                createdAt: order.createdAt
            });

            // Evento: Pagamento
            if (order.paidAt) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'payment',
                    eventStatus: 'success',
                    description: `Pagamento aprovado - ${order.paymentMethod}`,
                    metadata: { method: order.paymentMethod, amount: order.total },
                    createdBy: 'system',
                    createdAt: order.paidAt
                });
            }

            // Evento: Envio
            if (order.shippedAt) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'shipping',
                    eventStatus: 'success',
                    description: `Pedido enviado via ${order.carrier} - ${order.shippingMethod}`,
                    metadata: { carrier: order.carrier, tracking: order.tracking_code },
                    createdBy: 'admin',
                    createdAt: order.shippedAt
                });
            }

            // Evento: Entrega
            if (order.deliveredAt) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'shipping',
                    eventStatus: 'success',
                    description: 'Pedido entregue com sucesso',
                    metadata: { delivered_at: order.deliveredAt },
                    createdBy: 'system',
                    createdAt: order.deliveredAt
                });
            }

            // Evento: Cancelamento
            if (order.canceledAt) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'cancellation',
                    eventStatus: 'success',
                    description: `Pedido cancelado - ${order.cancellationReason}`,
                    metadata: { reason: order.cancellationReason },
                    createdBy: 'admin',
                    createdAt: order.canceledAt
                });
            }

            // Evento: Reembolso
            if (order.refundedAt) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'refund',
                    eventStatus: 'success',
                    description: `Reembolso processado - R$ ${order.refundAmount.toFixed(2)}`,
                    metadata: { amount: order.refundAmount },
                    createdBy: 'admin',
                    createdAt: order.refundedAt
                });
            }

            // Adicionar notas como eventos
            if (order.notes) {
                historyEvents.push({
                    orderId: order.id,
                    eventType: 'note',
                    eventStatus: 'success',
                    description: order.notes,
                    createdBy: 'admin',
                    createdAt: order.updatedAt
                });
            }

            // Criar todos os eventos de histórico
            await prisma.orderHistory.createMany({
                data: historyEvents
            });

            console.log(`  ✅ Pedido ${order.orderNumber} (${order.status}) criado com ${historyEvents.length} eventos`);

        } catch (error) {
            console.error(`  ❌ Erro ao criar pedido:`, error.message);
        }
    }

    const totalOrders = await prisma.order.count();
    const totalHistory = await prisma.orderHistory.count();

    console.log(`\n✅ Seed completado!`);
    console.log(`📦 ${ordersToCreate.length} novos pedidos criados`);
    console.log(`📊 Total de pedidos no sistema: ${totalOrders}`);
    console.log(`📜 Total de eventos de histórico: ${totalHistory}\n`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
