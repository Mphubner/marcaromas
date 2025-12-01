import { prisma } from '../lib/prisma.js';
import { sendEmail } from './email.service.js'; // Assuming this exists or will be adapted

/**
 * Send a notification to a user via specified channels
 * @param {Object} options
 * @param {number} options.userId - User ID
 * @param {string} options.type - Notification type (ORDER, SUBSCRIPTION, etc.)
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.link - Optional link
 * @param {Object} options.data - Optional dynamic data
 * @param {string[]} options.channels - Array of channels ['IN_APP', 'EMAIL', 'PUSH']
 */
export const sendNotification = async ({
    userId,
    type,
    title,
    message,
    link = null,
    data = {},
    channels = ['IN_APP']
}) => {
    try {
        // 1. Get User and Preferences
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                // Assuming we might have a relation, but for now we query separate if needed
                // or rely on default preferences if none exist
            }
        });

        if (!user) throw new Error('User not found');

        let preferences = await prisma.notificationPreference.findUnique({
            where: { userId }
        });

        // Create default preferences if not exists
        if (!preferences) {
            preferences = await prisma.notificationPreference.create({
                data: { userId }
            });
        }

        // 2. Check Category Preference
        // Map type to preference field (e.g., ORDER -> orders)
        const categoryMap = {
            'ORDER': 'orders',
            'SUBSCRIPTION': 'subscriptions',
            'REFERRAL': 'referrals',
            'ACHIEVEMENT': 'achievements',
            'PROMOTION': 'promotions',
            'CONTENT': 'content',
            'SYSTEM': null // System notifications always go through unless channel is off
        };

        const categoryField = categoryMap[type];
        if (categoryField && preferences[categoryField] === false) {
            console.log(`[Notification] User ${userId} opted out of ${type} notifications.`);
            return; // User opted out of this category
        }

        // 3. Process Channels
        const results = [];

        // --- IN_APP ---
        if (channels.includes('IN_APP') && preferences.in_app) {
            const notification = await prisma.notification.create({
                data: {
                    userEmail: user.email, // Using email as key for now based on schema, ideally userId
                    title,
                    message,
                    type,
                    category: type,
                    channel: 'IN_APP',
                    link,
                    data
                }
            });
            results.push({ channel: 'IN_APP', status: 'sent', id: notification.id });
        }

        // --- EMAIL ---
        if (channels.includes('EMAIL') && preferences.email) {
            // Use template if available or simple message
            // For now, we'll assume a generic email sender
            try {
                await sendEmail({
                    to: user.email,
                    subject: title,
                    html: `<p>${message}</p>${link ? `<a href="${link}">Ver mais</a>` : ''}`
                });
                results.push({ channel: 'EMAIL', status: 'sent' });
            } catch (error) {
                console.error('[Notification] Email send failed:', error);
                results.push({ channel: 'EMAIL', status: 'failed', error: error.message });
            }
        }

        // --- PUSH (Future) ---
        if (channels.includes('PUSH') && preferences.push) {
            // TODO: Implement Push Notification logic (Firebase/OneSignal)
            results.push({ channel: 'PUSH', status: 'skipped' });
        }

        return results;

    } catch (error) {
        console.error('[Notification] Error sending notification:', error);
        throw error;
    }
};

/**
 * Create a notification template
 */
export const createTemplate = async (data) => {
    return await prisma.notificationTemplate.create({ data });
};

/**
 * Get all templates
 */
export const getTemplates = async () => {
    return await prisma.notificationTemplate.findMany();
};
