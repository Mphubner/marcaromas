import { prisma } from '../lib/prisma.js';
import { sendNotification } from '../services/notification.service.js';

// --- USER ENDPOINTS ---

export const getMyNotifications = async (req, res, next) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, type, is_read } = req.query;

    const where = {
      userEmail: user.email,
      channel: 'IN_APP' // Only fetch in-app notifications for the UI list
    };

    if (type) where.type = type;
    if (is_read !== undefined) where.is_read = is_read === 'true';

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    const total = await prisma.notification.count({ where });
    const unreadCount = await prisma.notification.count({
      where: { userEmail: user.email, is_read: false, channel: 'IN_APP' }
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const user = req.user;

    // If 'all', mark all as read
    if (notificationId === 'all') {
      await prisma.notification.updateMany({
        where: { userEmail: user.email, is_read: false },
        data: { is_read: true }
      });
      return res.json({ message: 'All notifications marked as read' });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userEmail !== user.email) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const user = req.user;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userEmail !== user.email) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const user = req.user;
    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: user.id }
    });

    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId: user.id }
      });
    }

    res.json(preferences);
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const user = req.user;
    const data = req.body;

    // Prevent updating userId or id
    delete data.userId;
    delete data.id;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      update: data,
      create: { ...data, userId: user.id }
    });

    res.json(preferences);
  } catch (error) {
    next(error);
  }
};

// --- ADMIN ENDPOINTS ---

export const sendAdminNotification = async (req, res, next) => {
  try {
    const {
      target, // 'all', 'user', 'segment'
      userId, // if target='user'
      segment, // if target='segment' (e.g. 'active_subscribers')
      type,
      title,
      message,
      link,
      channels
    } = req.body;

    // 1. Determine recipients
    let recipients = [];

    if (target === 'user' && userId) {
      recipients = [userId];
    } else if (target === 'all') {
      const users = await prisma.user.findMany({ select: { id: true } });
      recipients = users.map(u => u.id);
    } else if (target === 'segment') {
      // TODO: Implement segment logic
      // For now, fetch all as fallback or implement basic segments
      const users = await prisma.user.findMany({ select: { id: true } });
      recipients = users.map(u => u.id);
    }

    // 2. Send in background (or batch)
    // For large numbers, this should be a background job (Bull/Redis)
    // For now, we'll map promises (careful with limits)

    let sentCount = 0;

    // Process in chunks of 50 to avoid overwhelming DB/Email service
    const chunkSize = 50;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async (uid) => {
        try {
          await sendNotification({
            userId: uid,
            type,
            title,
            message,
            link,
            channels
          });
          sentCount++;
        } catch (e) {
          console.error(`Failed to notify user ${uid}`, e);
        }
      }));
    }

    res.json({ message: 'Notifications queued/sent', count: sentCount });
  } catch (error) {
    next(error);
  }
};
