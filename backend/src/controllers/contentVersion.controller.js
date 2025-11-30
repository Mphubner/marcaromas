import { prisma } from '../lib/prisma.js';

/**
 * GET /api/content/:id/versions
 * List all versions of content
 */
export const getVersions = async (req, res) => {
    try {
        const { id } = req.params;

        const versions = await prisma.contentVersion.findMany({
            where: { content_id: id },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { version: 'desc' }
        });

        res.json({ versions });

    } catch (error) {
        console.error('Error fetching versions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/content/:id/versions
 * Create new version snapshot
 */
export const createVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const { change_description } = req.body;
        const userId = req.user.id;

        // Get current content with blocks
        const content = await prisma.content.findUnique({
            where: { id },
            include: {
                blocks: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        // Get latest version number
        const latestVersion = await prisma.contentVersion.findFirst({
            where: { content_id: id },
            orderBy: { version: 'desc' },
            select: { version: true }
        });

        const nextVersion = (latestVersion?.version || 0) + 1;

        // Create snapshot
        const version = await prisma.contentVersion.create({
            data: {
                content_id: id,
                version: nextVersion,
                title: content.title,
                excerpt: content.excerpt,
                data: {
                    ...content,
                    blocks: content.blocks
                },
                change_description,
                created_by: userId
            },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json(version);

    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/content/:id/versions/:version/restore
 * Restore content to specific version
 */
export const restoreVersion = async (req, res) => {
    try {
        const { id, version } = req.params;

        // Get version data
        const versionData = await prisma.contentVersion.findUnique({
            where: {
                content_id_version: {
                    content_id: id,
                    version: parseInt(version)
                }
            }
        });

        if (!versionData) {
            return res.status(404).json({ error: 'Version not found' });
        }

        const snapshot = versionData.data;

        // Delete existing blocks
        await prisma.contentBlock.deleteMany({
            where: { content_id: id }
        });

        // Restore content and blocks
        const restored = await prisma.content.update({
            where: { id },
            data: {
                title: snapshot.title,
                excerpt: snapshot.excerpt,
                cover_image: snapshot.cover_image,
                category: snapshot.category,
                tags: snapshot.tags,
                // Restore other fields if necessary
                blocks: {
                    create: snapshot.blocks.map(block => ({
                        type: block.type,
                        order: block.order,
                        data: block.data,
                        is_visible: block.is_visible
                    }))
                }
            },
            include: {
                blocks: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        res.json(restored);

    } catch (error) {
        console.error('Error restoring version:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
