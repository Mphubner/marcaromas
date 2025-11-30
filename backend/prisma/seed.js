import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- Helpers ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const generateCPF = () => {
  const n = () => randomInt(0, 9);
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
};
const generatePhone = () => `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`;

// --- Data Arrays ---
const firstNames = ['Ana', 'Bruno', 'Carla', 'Daniel', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Karina', 'Lucas', 'Mariana', 'Nicolas', 'Olivia', 'Pedro', 'Quintino', 'Rafaela', 'Samuel', 'Tatiana', 'Ursula', 'Vinicius', 'Wagner', 'Xuxa', 'Yago', 'Zara', 'Alessandro', 'Beatriz', 'Caio', 'Diana', 'Enzo', 'Fernanda', 'Gustavo', 'Helena', 'Igor', 'Julia', 'Kevin', 'Larissa', 'Miguel', 'Natalia', 'Otavio', 'Patricia', 'Renan', 'Sophia', 'Thiago', 'Vitoria', 'William', 'Yasmin'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Goncalves', 'Santana', 'Teixeira'];
const streets = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Av. Brasil', 'Rua do Ouvidor', 'Alameda Santos', 'Rua Oscar Freire', 'Av. Faria Lima', 'Rua da Consolação', 'Av. Ibirapuera', 'Rua Haddock Lobo', 'Av. Rebouças', 'Rua da Mooca', 'Av. Santo Amaro', 'Rua Vergueiro'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília', 'Fortaleza', 'Recife', 'Florianópolis', 'Manaus', 'Belém', 'Goiânia', 'Campinas', 'Vitória'];
const states = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'DF', 'CE', 'PE', 'SC', 'AM', 'PA', 'GO', 'SP', 'ES'];

const productNames = [
  { name: 'Óleo Essencial de Lavanda', price: 49.90, category: 'Óleos' },
  { name: 'Óleo Essencial de Alecrim', price: 45.90, category: 'Óleos' },
  { name: 'Óleo Essencial de Melaleuca', price: 52.90, category: 'Óleos' },
  { name: 'Óleo Essencial de Eucalipto', price: 48.90, category: 'Óleos' },
  { name: 'Óleo Essencial de Laranja Doce', price: 39.90, category: 'Óleos' },
  { name: 'Óleo Essencial de Hortelã-Pimenta', price: 55.90, category: 'Óleos' },
  { name: 'Vela Aromática Vanilla', price: 89.90, category: 'Velas' },
  { name: 'Vela Aromática Canela', price: 89.90, category: 'Velas' },
  { name: 'Vela Aromática Lavanda', price: 89.90, category: 'Velas' },
  { name: 'Vela Aromática Alecrim', price: 89.90, category: 'Velas' },
  { name: 'Difusor de Ambientes Bambu', price: 129.90, category: 'Difusores' },
  { name: 'Difusor de Ambientes Madeira', price: 149.90, category: 'Difusores' },
  { name: 'Kit Iniciante Aromaterapia', price: 199.90, category: 'Kits' },
  { name: 'Kit Relaxamento Total', price: 249.90, category: 'Kits' },
  { name: 'Box Essencial (Avulso)', price: 149.90, category: 'Box' },
  { name: 'Spray de Ambiente Lavanda', price: 39.90, category: 'Sprays' },
  { name: 'Spray de Ambiente Capim Limão', price: 39.90, category: 'Sprays' },
  { name: 'Sabonete Artesanal Argila', price: 29.90, category: 'Banho' },
  { name: 'Sais de Banho Relaxantes', price: 45.90, category: 'Banho' },
  { name: 'Incensos Naturais (Kit)', price: 35.90, category: 'Acessórios' },
];

const reviewComments = [
  "Adorei o produto! Chegou super rápido.",
  "A qualidade é incrível, recomendo muito.",
  "O cheiro é maravilhoso, dura o dia todo.",
  "A embalagem é linda, perfeito para presente.",
  "Gostei, mas achei o preço um pouco alto.",
  "Não atendeu minhas expectativas, o cheiro é fraco.",
  "Excelente atendimento da loja.",
  "Veio bem embalado e com um brinde!",
  "Compraria novamente com certeza.",
  "Produto natural de verdade, senti a diferença.",
  "Entrega atrasou um pouco, mas o produto compensa.",
  "Muito bom, vou assinar o clube.",
  "Minha casa ficou com um cheiro ótimo.",
  "Recomendo para quem gosta de aromaterapia.",
  "O melhor óleo essencial que já usei."
];

async function main() {
  console.log('🌱 Starting HIGH VOLUME seed...');

  // 1. Clean Database
  console.log('🧹 Cleaning database...');
  try {
    await prisma.shipment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderHistory.deleteMany(); // Added OrderHistory cleanup
    await prisma.order.deleteMany();
    await prisma.subscriptionHistory.deleteMany(); // Added SubscriptionHistory cleanup
    await prisma.subscription.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.box.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.product.deleteMany();
    await prisma.scentProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.warn("⚠️ Some tables might be empty or missing, continuing...", e.message);
  }

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Marc Aromas',
      email: 'admin@marcaromas.com',
      password: hashedPassword,
      isAdmin: true,
      status: 'active',
      phone: '(11) 99999-9999',
    }
  });
  console.log('👤 Admin created');

  // 3. Create Users (500)
  console.log('👥 Creating 500 users...');
  const users = [];
  for (let i = 0; i < 500; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        isAdmin: false,
        phone: generatePhone(),
        cpf: generateCPF(),
        birthdate: randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
        status: randomElement(['active', 'active', 'active', 'active', 'inactive']),
        address: {
          street: randomElement(streets),
          number: String(randomInt(1, 1000)),
          city: randomElement(cities),
          state: randomElement(states),
          zip: '01000-000'
        },
        lastLoginAt: randomDate(new Date(2025, 8, 1), new Date()), // Last 3 months
      }
    });
    users.push(user);
  }

  // 4. Create Products
  console.log('🛍️ Creating products...');
  const products = [];
  for (const p of productNames) {
    const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + randomInt(100, 999);
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: slug,
        description: `Descrição detalhada do ${p.name}. Produto de alta qualidade, 100% natural.`,
        price: p.price,
        category: p.category,
        stock_quantity: randomInt(10, 500),
        images: [`https://placehold.co/400x400?text=${encodeURIComponent(p.name)}`],
        is_featured: Math.random() > 0.8,
        is_available: true,
        aroma_notes: ['Lavanda', 'Baunilha', 'Cítrico'],
        ingredients: ['Óleo Essencial Puro', 'Cera Vegetal'],
        tags: ['Natural', 'Vegano', 'Cruelty-free'],
      }
    });
    products.push(product);
  }

  // 5. Create Plans
  console.log('📅 Creating plans...');
  const plans = await Promise.all([
    prisma.plan.create({ data: { name: 'Mensal', price: 99.90, description: 'Cobrança todo mês', items_included: ['1 Box'], benefits: ['Frete Grátis SP'], images: ['https://placehold.co/400x400?text=Mensal'] } }),
    prisma.plan.create({ data: { name: 'Trimestral', price: 284.70, description: 'Cobrança a cada 3 meses', items_included: ['3 Boxes'], benefits: ['Frete Grátis Brasil', '5% OFF'], images: ['https://placehold.co/400x400?text=Trimestral'] } }),
    prisma.plan.create({ data: { name: 'Semestral', price: 539.40, description: 'Cobrança a cada 6 meses', items_included: ['6 Boxes'], benefits: ['Frete Grátis Brasil', '10% OFF', 'Brinde Exclusivo'], images: ['https://placehold.co/400x400?text=Semestral'] } }),
    prisma.plan.create({ data: { name: 'Anual', price: 958.80, description: 'Cobrança anual', items_included: ['12 Boxes'], benefits: ['Frete Grátis Brasil', '20% OFF', 'Brinde VIP'], images: ['https://placehold.co/400x400?text=Anual'] } }),
  ]);

  // 6. Create Boxes (Nov 2025 - Dec 2026)
  console.log('📦 Creating boxes...');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const boxes = [];
  let currentDate = new Date(2025, 10, 1); // Nov 2025
  const endDate = new Date(2026, 11, 1); // Dec 2026

  while (currentDate <= endDate) {
    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const theme = `Tema ${monthName} ${year}`;

    const box = await prisma.box.create({
      data: {
        month: `${monthName} ${year}`,
        theme: theme,
        description: `Box especial de ${monthName} com aromas exclusivos.`,
        price: 99.90,
        is_available_for_purchase: true,
        is_published: true,
        stock_quantity: randomInt(50, 500),
        images: [`https://placehold.co/400x400?text=Box+${monthName}`],
        items_included: ['Vela Temática', 'Óleo Essencial Surpresa', 'Card Explicativo'],
        benefits: ['Aromaterapia', 'Bem-estar'],
        category: 'box',
        aroma_notes: ['Surpresa', 'Sazonal'],
      }
    });
    boxes.push(box);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // 7. Create Coupons (100)
  console.log('🎟️ Creating 100 coupons...');
  for (let i = 0; i < 100; i++) {
    const type = randomElement(['percent', 'fixed', 'free_shipping']);
    const isActive = Math.random() > 0.2; // 80% active
    await prisma.coupon.create({
      data: {
        code: `PROMO${i}${randomInt(100, 999)}`,
        type: type,
        amount: type === 'percent' ? randomInt(5, 30) : (type === 'fixed' ? randomInt(10, 50) : 0),
        min_purchase: Math.random() > 0.5 ? randomInt(50, 200) : null,
        usage_limit: Math.random() > 0.7 ? randomInt(10, 100) : null,
        times_used: randomInt(0, 50),
        is_active: isActive,
        description: `Cupom promocional ${i}`,
        startDate: randomDate(new Date(2025, 0, 1), new Date()),
        expiry_date: Math.random() > 0.8 ? randomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)) : randomDate(new Date(2026, 0, 1), new Date(2027, 0, 1)),
      }
    });
  }

  // 8. Create Subscriptions (300)
  console.log('💳 Creating 300 subscriptions...');
  for (let i = 0; i < 300; i++) {
    const user = randomElement(users);
    const plan = randomElement(plans);
    const status = randomElement(['active', 'active', 'active', 'cancelled', 'past_due']);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: status,
        startedAt: randomDate(new Date(2025, 8, 1), new Date()), // Last 3 months
        nextBilling: new Date(2026, 0, 1),
        paymentMethod: 'credit_card',
        deliveryCount: randomInt(0, 12),
        failedPaymentsCount: status === 'past_due' ? randomInt(1, 3) : 0,
      }
    });
  }

  // 9. Create Orders (1500)
  console.log('🛒 Creating 1500 orders...');
  const orders = [];
  for (let i = 0; i < 1500; i++) {
    const user = randomElement(users);
    const numItems = randomInt(1, 5);
    const orderProducts = randomElements(products, numItems);
    const totalAmount = orderProducts.reduce((sum, p) => sum + p.price, 0);
    const status = randomElement(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);
    const createdAt = randomDate(new Date(2025, 8, 1), new Date()); // Last 3 months

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${randomInt(10000, 99999)}-${i}`,
        total: totalAmount,
        subtotal: totalAmount,
        status: status,
        paymentStatus: status === 'cancelled' ? 'failed' : (status === 'pending' ? 'pending' : 'paid'),
        paymentMethod: randomElement(['credit_card', 'pix', 'boleto']),
        shippingAddress: user.address,
        createdAt: createdAt,
        items: {
          create: orderProducts.map(p => ({
            productId: p.id,
            quantity: 1,
            price: p.price,
            // name: p.name removed as it's not in schema
          }))
        }
      }
    });
    orders.push(order);

    // Create Shipment if shipped/delivered
    if (['shipped', 'delivered'].includes(status)) {
      await prisma.shipment.create({
        data: {
          userEmail: user.email,
          orderId: order.id,
          status: status,
          tracking_code: `TRK${randomInt(100000, 999999)}BR`,
          shipped_date: new Date(createdAt.getTime() + 86400000), // +1 day
        }
      });
    }
  }

  // 10. Create Reviews (500)
  console.log('⭐ Creating 500 reviews...');
  for (let i = 0; i < 500; i++) {
    const user = randomElement(users);
    const product = randomElement(products);
    const rating = randomInt(1, 5);
    const isApproved = Math.random() > 0.2;

    await prisma.review.create({
      data: {
        userEmail: user.email,
        userName: user.name,
        productId: product.id,
        rating: rating,
        title: rating > 3 ? 'Muito bom!' : 'Pode melhorar',
        comment: randomElement(reviewComments),
        is_verified_purchase: true,
        is_approved: isApproved,
        helpful_count: randomInt(0, 50),
        adminResponse: Math.random() > 0.8 ? 'Obrigado pelo feedback!' : null,
        respondedBy: Math.random() > 0.8 ? 'Admin' : null,
        respondedAt: Math.random() > 0.8 ? new Date() : null,
        reported: Math.random() > 0.95,
        createdAt: randomDate(new Date(2025, 8, 1), new Date()),
      }
    });
  }

  // 11. Create Referrals (100 pairs)
  console.log('🔗 Creating 100 referrals...');
  for (let i = 0; i < 100; i++) {
    const referrer = users[i];
    const referred = users[users.length - 1 - i];

    // Check if referred made an order
    const referredOrders = orders.filter(o => o.userId === referred.id);
    const hasOrder = referredOrders.length > 0;
    const status = hasOrder ? (Math.random() > 0.5 ? 'rewarded' : 'completed') : 'pending';

    await prisma.referral.create({
      data: {
        referrer_email: referrer.email,
        referrerName: referrer.name,
        referred_email: referred.email,
        referredName: referred.name,
        referral_code: `REF-${referrer.name.split(' ')[0].toUpperCase()}-${randomInt(100, 999)}`,
        status: status,
        reward_amount: 20.00,
        rewardPaid: status === 'rewarded',
        paidAt: status === 'rewarded' ? new Date() : null,
        completedAt: hasOrder ? referredOrders[0].createdAt : null,
        convertedOrderId: hasOrder ? referredOrders[0].id : null,
        createdAt: randomDate(new Date(2025, 8, 1), new Date()),
      }
    });
  }

  console.log('✅ High Volume Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
