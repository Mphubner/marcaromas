import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/admin/content/:id/blocks
 * Add block to content
 */
export const addBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, data, order, is_visible = true } = req.body;

        if (!type || !data) {
            return res.status(400).json({ error: 'Type and data are required' });
        }

        //Get max order if order not provided
        let blockOrder = order;
        if (blockOrder === undefined) {
            const maxBlock = await prisma.contentBlock.findFirst({
                where: { content_id: id },
                orderBy: { order: 'desc' }
            });
            blockOrder = maxBlock ? maxBlock.order + 1 : 0;
        }

        const block = await prisma.contentBlock.create({
            data: {
                content_id: id,
                type,
                data,
                order: blockOrder,
                is_visible
            }
        });

        res.status(201).json(block);

    } catch (error) {
        console.error('Error adding block:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/admin/content/blocks/:blockId
 * Update block
 */
export const updateBlock = async (req, res) => {
    try {
        const { blockId } = req.params;
        const { type, data, is_visible } = req.body;

        const block = await prisma.contentBlock.update({
            where: { id: blockId },
            data: {
                type,
                data,
                is_visible
            }
        });

        res.json(block);

    } catch (error) {
        console.error('Error updating block:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * DELETE /api/admin/content/blocks/:blockId
 * Delete block
 */
export const deleteBlock = async (req, res) => {
    try {
        const { blockId } = req.params;

        await prisma.contentBlock.delete({
            where: { id: blockId }
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Error deleting block:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/admin/content/:id/blocks/reorder
 * Reorder blocks
 */
export const reorderBlocks = async (req, res) => {
    try {
        const { id } = req.params;
        const { blocks } = req.body; // Array of { id, order }

        if (!Array.isArray(blocks)) {
            return res.status(400).json({ error: 'Blocks must be an array' });
        }

        // Update each block's order
        await prisma.$transaction(
            blocks.map(block =>
                prisma.contentBlock.update({
                    where: { id: block.id },
                    data: { order: block.order }
                })
            )
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Error reordering blocks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
