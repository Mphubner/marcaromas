import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

/**
 * GET /api/store/products
 * Endpoint unificado que retorna produtos + boxes para a loja pública
 * Boxes são transformadas em formato compatível com produtos
 */
router.get('/store/products', async (req, res) => {
    try {
        // 1. Buscar produtos disponíveis (Product usa is_available, não is_published)
        const products = await prisma.product.findMany({
            where: { is_available: true },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Buscar boxes publicadas e disponíveis para compra
        const boxes = await prisma.box.findMany({
            where: {
                is_published: true,
                is_available_for_purchase: true
            },
            orderBy: { month: 'asc' }
        });

        // 3. Transformar boxes para formato de produto
        const boxesAsProducts = boxes.map(box => {
            // Criar slug único para a box
            const slug = `box-${box.month.toLowerCase().replace(/\s+/g, '-')}`;

            // Usar images se disponível, senão image_url
            const images = box.images && box.images.length > 0
                ? box.images
                : (box.image_url ? [box.image_url] : []);

            return {
                // IDs únicos com prefixo
                id: `box-${box.id}`,
                original_id: box.id,
                type: 'box', // Flag para identificar como box

                // Campos compatíveis com produto
                name: `${box.theme} - ${box.month}`,
                slug: slug,
                price: box.price,
                compare_at_price: box.original_price,
                short_description: box.description?.substring(0, 150) + '...' || `Box mensal ${box.month}`,
                description: box.description,
                images: images,
                category: 'box', // Categoria especial
                aroma_family: null, // Boxes não têm aroma
                tags: [
                    'box mensal',
                    'assinatura',
                    ...(box.benefits || [])
                ],
                stock_quantity: box.stock_quantity !== null ? box.stock_quantity : 999,
                is_featured: false,
                is_available: box.is_available_for_purchase,

                // Dados específicos da box (preservados para página de detalhes)
                box_data: {
                    month: box.month,
                    theme: box.theme,
                    candle_name: box.candle_name,
                    aroma_notes: box.aroma_notes || [],
                    items_included: box.items_included || [],
                    benefits: box.benefits || [],
                    ritual_tips: box.ritual_tips,
                    spotify_playlist: box.spotify_playlist,
                    total_items_value: box.total_items_value,
                    category: box.category,
                    is_published: box.is_published
                }
            };
        });

        // 4. Combinar produtos e boxes
        const allProducts = [...products, ...boxesAsProducts];

        // 5. Log para debug
        console.log(`Store endpoint: ${products.length} produtos + ${boxes.length} boxes = ${allProducts.length} total`);

        res.json(allProducts);
    } catch (error) {
        console.error('Erro ao buscar produtos da loja:', error);
        res.status(500).json({
            message: 'Erro ao buscar produtos',
            error: error.message
        });
    }
});

/**
 * GET /api/store/boxes
 * Endpoint específico para buscar apenas boxes (opcional)
 */
router.get('/store/boxes', async (req, res) => {
    try {
        const boxes = await prisma.box.findMany({
            where: {
                is_published: true,
                is_available_for_purchase: true
            },
            orderBy: { month: 'asc' }
        });

        res.json(boxes);
    } catch (error) {
        console.error('Erro ao buscar boxes:', error);
        res.status(500).json({
            message: 'Erro ao buscar boxes',
            error: error.message
        });
    }
});

export default router;
