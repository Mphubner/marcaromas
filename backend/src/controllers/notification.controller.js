import { prisma } from '../lib/prisma.js';

// (Usuário) Buscar minhas notificações
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userEmail: req.user.email },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// (Usuário) Marcar notificação como lida
export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });
    res.json(notification);
  } catch (error) {
    next(error);
  }
};
