import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

/**
 * Content Scheduler
 * Auto-publishes content based on publish_date
 * Runs every 15 minutes
 */

export function startContentScheduler() {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        try {
            const now = new Date();

            // Find all draft content with publish_date <= now
            const toPublish = await prisma.content.findMany({
                where: {
                    status: 'DRAFT',
                    publish_date: {
                        lte: now,
                        not: null
                    }
                },
                select: {
                    id: true,
                    title: true,
                    publish_date: true
                }
            });

            if (toPublish.length > 0) {
                // Update all to PUBLISHED
                const result = await prisma.content.updateMany({
                    where: {
                        status: 'DRAFT',
                        publish_date: {
                            lte: now,
                            not: null
                        }
                    },
                    data: {
                        status: 'PUBLISHED'
                    }
                });

                console.log(`[Content Scheduler] Published ${result.count} scheduled posts:`);
                toPublish.forEach(content => {
                    console.log(`  - "${content.title}" (scheduled for ${content.publish_date})`);
                });
            }

        } catch (error) {
            console.error('[Content Scheduler] Error:', error);
        }
    });

    console.log('[Content Scheduler] Started - Running every 15 minutes');
}

// Alternative: Run scheduling check on demand
export async function publishScheduledContent() {
    try {
        const now = new Date();

        const result = await prisma.content.updateMany({
            where: {
                status: 'DRAFT',
                publish_date: {
                    lte: now,
                    not: null
                }
            },
            data: {
                status: 'PUBLISHED'
            }
        });

        return { published: result.count };

    } catch (error) {
        console.error('Error publishing scheduled content:', error);
        throw error;
    }
}
