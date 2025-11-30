import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Script para popular campos vazios das Boxes EXISTENTES no banco
 * Executa ANTES da migration com os novos campos
 */

async function main() {
    console.log('🔍 Buscando boxes existentes no banco...\n');

    const boxes = await prisma.box.findMany();

    if (boxes.length === 0) {
        console.log('✅ Nenhuma box encontrada. Banco está vazio - podemos prosseguir com a migration.');
        return;
    }

    console.log(`📦 Encontradas ${boxes.length} boxes no banco\n`);

    for (const box of boxes) {
        console.log(`\n📝 Atualizando Box #${box.id}: ${box.month || 'Sem mês'} - ${box.theme || 'Sem tema'}`);

        const updates = {};

        // Preencher campos básicos vazios
        if (!box.theme || box.theme.trim() === '') {
            updates.theme = `Tema Box #${box.id}`;
            console.log(`  ✏️  Adicionando theme: ${updates.theme}`);
        }

        if (!box.month || box.month.trim() === '') {
            const monthsMap = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const randomMonth = monthsMap[Math.floor(Math.random() * monthsMap.length)];
            updates.month = `${randomMonth} ${2025 + Math.floor(box.id / 12)}`;
            console.log(`  ✏️  Adicionando month: ${updates.month}`);
        }

        if (!box.description) {
            updates.description = `Descrição completa da box ${box.theme || box.month || box.id}. Uma experiência aromática única com velas artesanais e produtos exclusivos.`;
            console.log(`  ✏️  Adicionando description`);
        }

        if (!box.candle_name) {
            updates.candle_name = `Vela ${box.theme || 'Artesanal'}`;
            console.log(`  ✏️  Adicionando candle_name: ${updates.candle_name}`);
        }

        if (!box.aroma_notes || box.aroma_notes.length === 0) {
            updates.aroma_notes = ['Lavanda', 'Baunilha', 'Sândalo'];
            console.log(`  ✏️  Adicionando aroma_notes: ${updates.aroma_notes.join(', ')}`);
        }

        if (!box.image_url) {
            updates.image_url = 'https://images.unsplash.com/photo-1602874801006-8a9b0ee71f77?w=800';
            console.log(`  ✏️  Adicionando image_url (placeholder)`);
        }

        if (!box.images || box.images.length === 0) {
            updates.images = [
                'https://images.unsplash.com/photo-1602874801006-8a9b0ee71f77?w=800',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
            ];
            console.log(`  ✏️  Adicionando images (2 placeholders)`);
        }

        if (!box.spotify_playlist) {
            updates.spotify_playlist = 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u';
            console.log(`  ✏️  Adicionando spotify_playlist (placeholder)`);
        }

        if (!box.ritual_tips) {
            updates.ritual_tips = `Acenda a vela ${box.candle_name || 'artesanal'} em um momento de tranquilidade. Respire profundamente e permita que os aromas criem um ambiente de paz e bem-estar.`;
            console.log(`  ✏️  Adicionando ritual_tips`);
        }

        // Publicar se ainda não estiver
        if (box.is_published === false) {
            updates.is_published = true;
            console.log(`  ✏️  Marcando como publicada`);
        }

        // Aplicar atualizações se houver
        if (Object.keys(updates).length > 0) {
            await prisma.box.update({
                where: { id: box.id },
                data: updates
            });
            console.log(`  ✅ Box #${box.id} atualizada com ${Object.keys(updates).length} campos`);
        } else {
            console.log(`  ℹ️  Box #${box.id} já possui todos os campos preenchidos`);
        }
    }

    console.log('\n\n✅ CONCLUÍDO! Todas as boxes existentes foram atualizadas.');
    console.log('\n📌 PRÓXIMOS PASSOS:');
    console.log('   1. Execute a migration: npx prisma migrate dev --name add_box_pricing_and_items');
    console.log('   2. Execute o seed completo: node prisma/seeds/seedBoxes.js\n');
}

main()
    .catch((e) => {
        console.error('\n❌ Erro ao popular boxes:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
