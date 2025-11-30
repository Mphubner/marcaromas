import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
const paymentStatuses = ['approved', 'pending', 'failed'];
const subscriptionStatuses = ['active', 'paused', 'canceled'];

// Gerar endereço fictício
function generateAddress() {
    const streets = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Alameda Santos', 'Rua Oscar Freire'];
    const neighborhoods = ['Jardins', 'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Moema'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];
    const states = ['SP', 'RJ', 'MG', 'PR', 'RS'];

    return {
        street: streets[Math.floor(Math.random() * streets.length)],
        number: Math.floor(Math.random() * 1000) + 1,
        complement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 100) + 1}` : null,
        neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`
    };
}

// Gerar data aleatória nos últimos X meses
function randomDate(monthsAgo) {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - monthsAgo);
    const diff = now.getTime() - past.getTime();
    return new Date(past.getTime() + Math.random() * diff);
}

async function main() {
    console.log('🎯 Iniciando seed de Assinaturas...\n');

    // Buscar usuários e planos existentes
    const users = await prisma.user.findMany({ take: 30 });
    const plans = await prisma.plan.findMany();

    if (users.length === 0) {
        console.log('❌ Nenhum usuário encontrado. Execute o seed de usuários primeiro.');
        return;
    }

    if (plans.length === 0) {
        console.log('❌ Nenhum plano encontrado. Execute o seed de planos primeiro.');
        return;
    }

    console.log(`✅ Encontrados ${users.length} usuários e ${plans.length} planos\n`);

    // Limpar assinaturas antigas de teste (manter as 300 reais)
    // Vamos apenas adicionar as novas sem deletar

    const subscriptionsData = [];

    // Criar 30 assinaturas  variadas
    for (let i = 0; i < Math.min(30, users.length); i++) {
        const user = users[i];
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const status = subscriptionStatuses[Math.floor(Math.random() * subscriptionStatuses.length)];
        const startedAt = randomDate(12); // Nos últimos 12 meses
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Distribuição de status: 50% ativa, 25% pausada, 25% cancelada
        let finalStatus;
        if (i < 15) finalStatus = 'active';
        else if (i < 23) finalStatus = 'paused';
        else finalStatus = 'canceled';

        const deliveryAddress = generateAddress();
        const billingAddress = Math.random() > 0.7 ? deliveryAddress : generateAddress();

        // Calcular delivery count baseado no tempo
        const monthsSinceStart = Math.floor((new Date() - startedAt) / (1000 * 60 * 60 * 24 * 30));
        const baseDeliveryCount = Math.min(monthsSinceStart, finalStatus === 'canceled' ? monthsSinceStart / 2 : monthsSinceStart);
        const deliveryCount = Math.max(0, Math.floor(baseDeliveryCount));

        // Definir próxima cobrança
        let nextBilling = null;
        if (finalStatus === 'active') {
            nextBilling = new Date();
            nextBilling.setDate(nextBilling.getDate() + Math.floor(Math.random() * 30) + 1);
        }

        // Pausas e cancelamento
        let pausedAt = null;
        let pauseCount = 0;
        let canceledAt = null;
        let cancellationReason = null;

        if (finalStatus === 'paused') {
            pausedAt = randomDate(2);
            pauseCount = Math.floor(Math.random() * 3) + 1;
        }

        if (finalStatus === 'canceled') {
            canceledAt = randomDate(3);
            const reasons = [
                'Solicitado pelo cliente',
                'Problemas financeiros',
                'Não atendeu expectativas',
                'Mudou de endereço',
                'Falha recorrente de pagamento'
            ];
            cancellationReason = reasons[Math.floor(Math.random() * reasons.length)];
        }

        // Pagamentos falhados (algumas assinaturas)
        const failedPaymentsCount = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
        const lastPaymentStatus = failedPaymentsCount > 0 && Math.random() > 0.5 ? 'failed' : 'approved';
        const lastPaymentDate = deliveryCount > 0 ? randomDate(1) : null;

        const subscriptionData = {
            userId: user.id,
            planId: plan.id,
            status: finalStatus,
            startedAt,
            pausedAt,
            pauseCount,
            canceledAt,
            cancellationReason,
            paymentMethod,
            lastPaymentDate,
            lastPaymentStatus,
            failedPaymentsCount,
            nextBilling,
            renewalDate: finalStatus === 'active' ? nextBilling : null,
            lastDeliveryDate: deliveryCount > 0 ? randomDate(1) : null,
            deliveryCount,
            deliveryAddress,
            billingAddress,
            preferences: {
                deliveryDay: Math.floor(Math.random() * 28) + 1,
                notificationsEnabled: Math.random() > 0.3,
                preferredTime: Math.random() > 0.5 ? 'morning' : 'afternoon'
            }
        };

        subscriptionsData.push(subscriptionData);
    }

    console.log('📝 Criando assinaturas...\n');

    const createdSubscriptions = [];

    for (const subData of subscriptionsData) {
        const subscription = await prisma.subscription.create({
            data: subData
        });
        createdSubscriptions.push(subscription);

        const userName = users.find(u => u.id === subData.userId)?.name || 'Desconhecido';
        const planName = plans.find(p => p.id === subData.planId)?.name || 'Desconhecido';
        console.log(`  ✅ ${subscription.status.padEnd(10)} | ${userName.padEnd(20)} | ${planName}`);
    }

    console.log(`\n📦 ${createdSubscriptions.length} assinaturas criadas!\n`);

    // Criar histórico para cada assinatura
    console.log('📚 Criando histórico de eventos...\n');

    let totalEvents = 0;

    for (const subscription of createdSubscriptions) {
        const events = [];

        // Evento de criação
        events.push({
            subscriptionId: subscription.id,
            eventType: 'subscription_created',
            eventStatus: 'success',
            description: 'Assinatura iniciada',
            metadata: { plan: subscription.planId },
            createdAt: subscription.startedAt
        });

        // Pagamentos mensais baseado em delivery count
        for (let i = 0; i < subscription.deliveryCount; i++) {
            const paymentDate = new Date(subscription.startedAt);
            paymentDate.setMonth(paymentDate.getMonth() + i);

            events.push({
                subscriptionId: subscription.id,
                eventType: 'payment',
                eventStatus: 'success',
                description: `Pagamento mensal #${i + 1} aprovado`,
                metadata: { amount: 119.90, method: subscription.paymentMethod },
                createdAt: paymentDate
            });

            // Entrega correspondente
            const deliveryDate = new Date(paymentDate);
            deliveryDate.setDate(deliveryDate.getDate() + 5);

            events.push({
                subscriptionId: subscription.id,
                eventType: 'delivery',
                eventStatus: 'success',
                description: `Box #${i + 1} entregue`,
                metadata: { trackingCode: `BR${Math.random().toString(36).substring(2, 15).toUpperCase()}` },
                createdAt: deliveryDate
            });
        }

        // Pagamentos falhados
        for (let i = 0; i < subscription.failedPaymentsCount; i++) {
            events.push({
                subscriptionId: subscription.id,
                eventType: 'payment',
                eventStatus: 'failed',
                description: 'Tentativa de pagamento recusada',
                metadata: { reason: 'Cartão sem limite', attempt: i + 1 },
                createdAt: randomDate(2)
            });
        }

        // Pausas
        if (subscription.pauseCount > 0) {
            for (let i = 0; i < subscription.pauseCount; i++) {
                const pauseDate = randomDate(6);
                events.push({
                    subscriptionId: subscription.id,
                    eventType: 'pause',
                    eventStatus: 'success',
                    description: 'Assinatura pausada pelo cliente',
                    metadata: { reason: 'Férias' },
                    createdAt: pauseDate
                });

                // Resume if not the last pause
                if (i < subscription.pauseCount - 1 || subscription.status !== 'paused') {
                    const resumeDate = new Date(pauseDate);
                    resumeDate.setMonth(resumeDate.getMonth() + 1);
                    events.push({
                        subscriptionId: subscription.id,
                        eventType: 'resume',
                        eventStatus: 'success',
                        description: 'Assinatura reativada',
                        createdAt: resumeDate
                    });
                }
            }
        }

        // Cancelamento
        if (subscription.status === 'canceled') {
            events.push({
                subscriptionId: subscription.id,
                eventType: 'cancellation',
                eventStatus: 'success',
                description: `Assinatura cancelada: ${subscription.cancellationReason}`,
                metadata: { reason: subscription.cancellationReason },
                createdAt: subscription.canceledAt
            });
        }

        // Ordenar eventos por data
        events.sort((a, b) => a.createdAt - b.createdAt);

        // Criar todos os eventos
        await prisma.subscriptionHistory.createMany({
            data: events
        });

        totalEvents += events.length;
    }

    console.log(`✅ ${totalEvents} eventos de histórico criados!\n`);

    console.log('🎉 Seed de assinaturas concluído!\n');
    console.log('📊 Resumo:');
    console.log(`   • ${createdSubscriptions.filter(s => s.status === 'active').length} assinaturas ativas`);
    console.log(`   • ${createdSubscriptions.filter(s => s.status === 'paused').length} assinaturas pausadas`);
    console.log(`   • ${createdSubscriptions.filter(s => s.status === 'canceled').length} assinaturas canceladas`);
    console.log(`   • ${totalEvents} eventos no histórico`);
    console.log(`   • Métodos de pagamento variados`);
    console.log(`   • ${createdSubscriptions.filter(s => s.failedPaymentsCount > 0).length} com falhas de pagamento\n`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
