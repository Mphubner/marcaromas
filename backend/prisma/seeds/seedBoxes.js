import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const boxesData = [
    {
        month: "Dezembro 2025",
        theme: "Magia do Natal",
        description: "Celebre o Natal com aromas acolhedores de especiarias e frutas cítricas. Uma experiência sensorial que traz o espírito natalino para sua casa.",
        image_url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800",
        images: [
            "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800",
            "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800"
        ],
        candle_name: "Vela Especiarias Natalinas",
        aroma_notes: ["Canela", "Cravo", "Laranja", "Anis Estrelado"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Sachê aromático de especiarias",
            "1 Carta com ritual natalino",
            "1 Playlist QR code exclusiva"
        ],
        benefits: [
            "Aromas exclusivos de celebração",
            "Playlist especial para festas",
            "Dicas de decoração aromática"
        ],
        price: 129.90,
        original_price: 180.00,
        total_items_value: 180.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 50,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX0Yxoavh5qJV",
        ritual_tips: "Acenda sua vela durante a ceia de Natal. Os aromas de especiarias criarão uma atmosfera acolhedora e festiva para celebrar com seus entes queridos.",
        is_published: true
    },
    {
        month: "Janeiro 2026",
        theme: "Novos Começos",
        description: "Inicie o ano com energia renovada. Aromas cítricos e refrescantes para estimular criatividade e foco nos seus objetivos.",
        image_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
        images: [
            "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
            "https://images.unsplash.com/photo-1519671282429-b44660aac9a6?w=800"
        ],
        candle_name: "Vela Energia Cítrica",
        aroma_notes: ["Limão Siciliano", "Bergamota", "Hortelã", "Gengibre"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Óleo essencial energizante 10ml",
            "1 Diário de gratidão minimalista",
            "1 Marcador de página aromático"
        ],
        benefits: [
            "Aromas que estimulam foco",
            "Playlist motivacional",
            "Ritual matinal de energia"
        ],
        price: 119.90,
        original_price: 165.00,
        total_items_value: 165.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 60,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP",
        ritual_tips: "Acenda sua vela pela manhã enquanto define suas metas para o ano. Os aromas cítricos ajudarão a clarear sua mente e energizar seu dia.",
        is_published: true
    },
    {
        month: "Fevereiro 2026",
        theme: "Amor & Autocuidado",
        description: "Celebre o amor próprio e os relacionamentos com aromas florais românticos. Perfeito para criar momentos especiais.",
        image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
        images: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800"
        ],
        candle_name: "Vela Pétalas de Rosa",
        aroma_notes: ["Rosa", "Jasmim", "Baunilha", "Sândalo"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Máscara facial hidratante",
            "1 Sabonete artesanal de rosas",
            "1 Sais de banho relaxantes"
        ],
        benefits: [
            "Aromas românticos e relaxantes",
            "Playlist para momentos a dois",
            "Ritual de autocuidado semanal"
        ],
        price: 139.90,
        original_price: 195.00,
        total_items_value: 195.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 45,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWXmlLSKkfdAk",
        ritual_tips: "Reserve uma noite para si mesmo. Prepare um banho aromático com os sais, acenda a vela e permita-se relaxar completamente.",
        is_published: true
    },
    {
        month: "Março 2026",
        theme: "Renovação da Primavera",
        description: "Celebre a chegada da primavera com aromas florais frescos que trazem renovação e alegria.",
        image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
        images: [
            "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
            "https://images.unsplash.com/photo-1463620695885-8a91d87c53d0?w=800"
        ],
        candle_name: "Vela Jardim Florido",
        aroma_notes: ["Lavanda", "Lírio", "Flor de Laranjeira", "Ylang Ylang"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Difusor de varetas floral",
            "1 Spray aromático para ambiente",
            "1 Sachê de flores secas"
        ],
        benefits: [
            "Aromas primaverais refrescantes",
            "Playlist de renovação",
            "Dicas de limpeza energética"
        ],
        price: 124.90,
        original_price: 170.00,
        total_items_value: 170.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 55,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn",
        ritual_tips: "Use o spray aromático pela manhã para renovar a energia da sua casa. Acenda a vela durante a limpeza para criar um ambiente revitalizante.",
        is_published: true
    },
    {
        month: "Abril 2026",
        theme: "Equilíbrio & Harmonia",
        description: "Encontre o equilíbrio perfeito entre corpo e mente com aromas que promovem harmonia interior.",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
        images: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"
        ],
        candle_name: "Vela Zen Garden",
        aroma_notes: ["Capim Limão", "Eucalipto", "Menta", "Cedro"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Kit de meditação (incenso + suporte)",
            "1 Cristal de quartzo rosa",
            "1 Tapete de yoga mini"
        ],
        benefits: [
            "Aromas equilibrantes",
            "Playlist de meditação",
            "Guia de yoga aromático"
        ],
        price: 149.90,
        original_price: 210.00,
        total_items_value: 210.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 40,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
        ritual_tips: "Pratique 10 minutos de meditação diária com a vela acesa. Os aromas ajudarão a criar um espaço sagrado para sua prática.",
        is_published: true
    },
    {
        month: "Maio 2026",
        theme: "Despertar dos Sentidos",
        description: "Desperte todos os seus sentidos com uma combinação única de aromas exóticos e envolventes.",
        image_url: "https://images.unsplash.com/photo-1602874801006-8a9b0ee71f77?w=800",
        images: [
            "https://images.unsplash.com/photo-1602874801006-8a9b0ee71f77?w=800",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ],
        candle_name: "Vela Especiarias Exóticas",
        aroma_notes: ["Cardamomo", "Patchouli", "Âmbar", "Vetiver"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Óleo corporal aromático 50ml",
            "1 Esfoliante corporal natural",
            "1 Vela mini de massagem"
        ],
        benefits: [
            "Aromas sensuais e exóticos",
            "Playlist sensorial",
            "Ritual de autocuidado corporal"
        ],
        price: 134.90,
        original_price: 185.00,
        total_items_value: 185.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 50,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWWEJlAGA9gs0",
        ritual_tips: "Crie um ritual de autocuidado semanal. Use o esfoliante, aplique o óleo aromático e acenda a vela para uma experiência completa.",
        is_published: true
    },
    {
        month: "Junho 2026",
        theme: "Aconchego de Inverno",
        description: "Traz o aconchego e o calor para os dias frios de inverno com aromas reconfortantes.",
        image_url: "https://images.unsplash.com/photo-1483691278019-cb7253bee49f?w=800",
        images: [
            "https://images.unsplash.com/photo-1483691278019-cb7253bee49f?w=800",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
        ],
        candle_name: "Vela Café & Especiarias",
        aroma_notes: ["Café", "Chocolate", "Canela", "Noz Moscada"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Xícara de cerâmica exclusiva",
            "1 Blend de chá especial",
            "1 Manta aromática pequena"
        ],
        benefits: [
            "Aromas reconfortantes",
            "Playlist para dias chuvosos",
            "Receitas de bebidas quentes"
        ],
        price: 144.90,
        original_price: 200.00,
        total_items_value: 200.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 45,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx",
        ritual_tips: "Nos dias frios, prepare seu chá favorito, acenda a vela e enrole-se na manta para momentos de puro aconchego.",
        is_published: true
    },
    {
        month: "Julho 2026",
        theme: "Calor do Lar",
        description: "Transforme sua casa em um refúgio acolhedor com aromas que celebram o calor do lar.",
        image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        images: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
        ],
        candle_name: "Vela Madeira & Mel",
        aroma_notes: ["Cedro", "Mel", "Baunilha", "Âmbar"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Difusor reed sticks amadeirado",
            "1 Almofada aromática",
            "1 Porta-velas decorativo"
        ],
        benefits: [
            "Aromas acolhedores",
            "Playlist para momentos em família",
            "Dicas de decoração aromática"
        ],
        price: 129.90,
        original_price: 175.00,
        total_items_value: 175.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 52,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
        ritual_tips: "Crie um cantinho especial em casa com a vela e o difusor. Este será seu espaço de paz e tranquilidade.",
        is_published: true
    },
    {
        month: "Agosto 2026",
        theme: "Energia Vital",
        description: "Renove suas energias com aromas revigorantes que despertam vitalidade e disposição.",
        image_url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
        images: [
            "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
        ],
        candle_name: "Vela Tangerina & Gengibre",
        aroma_notes: ["Tangerina", "Gengibre", "Pimenta Rosa", "Limão"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Bálsamo energizante roll-on",
            "1 Sabonete líquido cítrico",
            "1 Toalha de rosto premium"
        ],
        benefits: [
            "Aromas energizantes",
            "Playlist motivacional",
            "Rotina matinal energizante"
        ],
        price: 119.90,
        original_price: 160.00,
        total_items_value: 160.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 58,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
        ritual_tips: "Use o bálsamo roll-on pela manhã em pontos de pulso. Acenda a vela durante o café da manhã para começar o dia com energia.",
        is_published: true
    },
    {
        month: "Setembro 2026",
        theme: "Flores da Primavera",
        description: "Celebre a primavera com uma explosão de aromas florais delicados e inspiradores.",
        image_url: "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=800",
        images: [
            "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=800",
            "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=800"
        ],
        candle_name: "Vela Bouquet Floral",
        aroma_notes: ["Peônia", "Gardênia", "Magnólia", "Neroli"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Perfume para ambientes floral",
            "1 Sachê de lavanda francesa",
            "1 Mini bouquet de flores secas"
        ],
        benefits: [
            "Aromas florais delicados",
            "Playlist primaveril",
            "Guia de arranjos aromáticos"
        ],
        price: 139.90,
        original_price: 190.00,
        total_items_value: 190.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 48,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DWYxeXFMskIEn",
        ritual_tips: "Decore sua casa com o bouquet de flores secas. Use o perfume de ambientes e acenda a vela para criar um jardim aromático indoor.",
        is_published: true
    },
    {
        month: "Outubro 2026",
        theme: "Mistérios Outonais",
        description: "Mergulhe nos mistérios do outono com aromas terrosos e envolventes.",
        image_url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800",
        images: [
            "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800"
        ],
        candle_name: "Vela Folhas de Outono",
        aroma_notes: ["Musgo", "Folhas Secas", "Tabaco", "Couro"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Incenso de madeiras nobres",
            "1 Pedra vulcânica aromática",
            "1 Livro de poesias outono"
        ],
        benefits: [
            "Aromas terrosos e místicos",
            "Playlist contemplativa",
            "Ritual de introspecção"
        ],
        price: 134.90,
        original_price: 180.00,
        total_items_value: 180.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 42,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX6GwdWRQMQpq",
        ritual_tips: "Crie momentos de introspecção. Acenda a vela ao anoitecer, queime o incenso e mergulhe em leituras reflexivas.",
        is_published: true
    },
    {
        month: "Novembro 2026",
        theme: "Gratidão",
        description: "Celebre a gratidão com aromas que aquecem o coração e elevam o espírito.",
        image_url: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=800",
        images: [
            "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=800",
            "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800"
        ],
        candle_name: "Vela Âmbar & Mirra",
        aroma_notes: ["Âmbar", "Mirra", "Incenso", "Olíbano"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Diário de gratidão premium",
            "1 Caneta especial",
            "1 Cristal de citrino"
        ],
        benefits: [
            "Aromas espirituais",
            "Playlist de contemplação",
            "Prática diária de gratidão"
        ],
        price: 144.90,
        original_price: 195.00,
        total_items_value: 195.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 46,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
        ritual_tips: "Antes de dormir, escreva três coisas pelas quais você é grato enquanto a vela queima. Este ritual transformará sua perspectiva.",
        is_published: true
    },
    {
        month: "Dezembro 2026",
        theme: "Encanto Natalino",
        description: "Encerre o ano com a magia do Natal. Aromas festivos que celebram um ano de conquistas.",
        image_url: "https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=800",
        images: [
            "https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=800",
            "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800"
        ],
        candle_name: "Vela Pinheiro & Cranberry",
        aroma_notes: ["Pinheiro", "Cranberry", "Casca de Laranja", "Zimbro"],
        items_included: [
            "1 Vela artesanal de soja 180g",
            "1 Enfeite de Natal aromático",
            "1 Guirlanda mini de pinheiro",
            "1 Óleo essencial festivo"
        ],
        benefits: [
            "Aromas festivos de Natal",
            "Playlist de celebração",
            "Decoração aromática natalina"
        ],
        price: 149.90,
        original_price: 205.00,
        total_items_value: 205.00,
        is_available_for_purchase: true,
        category: "box",
        stock_quantity: 55,
        spotify_playlist: "https://open.spotify.com/playlist/37i9dQZF1DX0Yxoavh5qJV",
        ritual_tips: "Decore sua árvore com o enfeite aromático. Acenda a vela durante as celebrações para criar memórias olfativas inesquecíveis.",
        is_published: true
    }
];

async function main() {
    console.log('🌱 Iniciando seed de Boxes (Dez/2025 a Dez/2026)...\n');

    // Deletar todas as boxes existentes
    const deleteResult = await prisma.box.deleteMany({});
    console.log(`🗑️ ${deleteResult.count} boxes antigas removidas\n`);

    // Criar as novas boxes
    for (const boxData of boxesData) {
        const box = await prisma.box.create({
            data: boxData
        });
        console.log(`✅ Box criada: ${box.month} - ${box.theme}`);
    }

    console.log(`\n🎉 Seed concluído! ${boxesData.length} boxes criadas (Dez/2025 a Dez/2026)`);
    console.log('\n📊 Resumo das Boxes:');
    console.log(`   • Todas publicadas e disponíveis para compra`);
    console.log(`   • Preços: R$ 119,90 a R$ 149,90`);
    console.log(`   • Valor médio em produtos: R$ 185,00`);
    console.log(`   • Todos os campos preenchidos ✓\n`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
